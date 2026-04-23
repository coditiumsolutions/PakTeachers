using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;
using PakTeachers.Api.Wrappers;

namespace PakTeachers.Api.Services;

public class PaymentService(PakTeachersDbContext db) : IPaymentService
{
    private static readonly HashSet<string> AdminRoles =
        new(StringComparer.OrdinalIgnoreCase) { "super_admin", "admin", "support" };

    private static bool IsAdmin(string? role) => role is not null && AdminRoles.Contains(role);
    private static bool IsSuperAdmin(string? role) =>
        "super_admin".Equals(role, StringComparison.OrdinalIgnoreCase);

    // ── PAGINATED LIST (Admin/Support only) ───────────────────────────────────

    public async Task<ApiResponse<PagedResult<PaymentListItemDto>>> GetPaymentsAsync(
        int page, int pageSize,
        string? status, string? method, int? studentId, int? enrollmentId,
        DateTime? from, DateTime? to)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        var query = db.Payments.AsNoTracking()
            .Include(p => p.Student)
            .AsQueryable();

        if (status is not null)
            query = query.Where(p => p.Status == status);
        if (method is not null)
            query = query.Where(p => p.Method == method);
        if (studentId.HasValue)
            query = query.Where(p => p.StudentId == studentId.Value);
        if (enrollmentId.HasValue)
            query = query.Where(p => p.EnrollmentId == enrollmentId.Value);
        if (from.HasValue)
            query = query.Where(p => p.PaidAt >= from.Value);
        if (to.HasValue)
            query = query.Where(p => p.PaidAt <= to.Value);

        var total = await query.CountAsync();

        var raw = await query
            .OrderByDescending(p => p.PaidAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = raw.Select(MapToSummaryDto).ToList();

        return new ApiResponse<PagedResult<PaymentListItemDto>>(new PagedResult<PaymentListItemDto>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        });
    }

    // ── GET BY ID ─────────────────────────────────────────────────────────────

    public async Task<ApiResponse<PaymentDetailDto>> GetPaymentByIdAsync(int paymentId)
    {
        var payment = await db.Payments.AsNoTracking()
            .Include(p => p.Student)
            .Include(p => p.Enrollment)
                .ThenInclude(e => e.Course)
            .FirstOrDefaultAsync(p => p.PaymentId == paymentId);

        if (payment is null)
            return new ApiResponse<PaymentDetailDto>("Payment not found.");

        return new ApiResponse<PaymentDetailDto>(MapToDetailDto(payment));
    }

    // ── GET BY STUDENT ────────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<PaymentStudentViewDto>>> GetPaymentsByStudentAsync(
        int studentId, string? status, string? callerRole, int callerId)
    {
        bool isStudent = "student".Equals(callerRole, StringComparison.OrdinalIgnoreCase);

        if (isStudent && callerId != studentId)
            return new ApiResponse<IEnumerable<PaymentStudentViewDto>>("Access denied.");

        if (!isStudent && !IsAdmin(callerRole))
            return new ApiResponse<IEnumerable<PaymentStudentViewDto>>("Access denied.");

        var student = await db.Students.AsNoTracking()
            .FirstOrDefaultAsync(s => s.StudentId == studentId);
        if (student is null)
            return new ApiResponse<IEnumerable<PaymentStudentViewDto>>("Student not found.");

        var query = db.Payments.AsNoTracking()
            .Include(p => p.Enrollment)
                .ThenInclude(e => e.Course)
            .Where(p => p.StudentId == studentId)
            .AsQueryable();

        if (status is not null)
            query = query.Where(p => p.Status == status);

        var raw = await query
            .OrderByDescending(p => p.PaidAt)
            .ToListAsync();

        var items = raw.Select(p => new PaymentStudentViewDto
        {
            PaymentId = p.PaymentId,
            EnrollmentId = p.EnrollmentId,
            CourseTitle = p.Enrollment?.Course?.Title ?? "",
            Amount = p.Amount,
            Currency = p.Currency,
            Method = p.Method,
            PaidAt = p.PaidAt,
            Status = p.Status
        }).ToList();

        return new ApiResponse<IEnumerable<PaymentStudentViewDto>>(items);
    }

    // ── CREATE PAYMENT ────────────────────────────────────────────────────────

    public async Task<ApiResponse<PaymentDetailDto>> CreatePaymentAsync(PaymentCreateDto dto)
    {
        if (dto.Amount <= 0)
            return new ApiResponse<PaymentDetailDto>("Amount must be greater than 0.");

        var enrollment = await db.Enrollments.AsNoTracking()
            .Include(e => e.Course)
            .FirstOrDefaultAsync(e => e.EnrollmentId == dto.EnrollmentId);

        if (enrollment is null)
            return new ApiResponse<PaymentDetailDto>("Enrollment not found.");

        if (enrollment.StudentId != dto.StudentId)
            return new ApiResponse<PaymentDetailDto>("Enrollment does not belong to this student.");

        var student = await db.Students.AsNoTracking()
            .FirstOrDefaultAsync(s => s.StudentId == dto.StudentId);
        if (student is null)
            return new ApiResponse<PaymentDetailDto>("Student not found.");

        // Conflict check: block if active (pending/completed) payment exists
        bool activeExists = await db.Payments.AsNoTracking()
            .AnyAsync(p => p.EnrollmentId == dto.EnrollmentId &&
                           (p.Status == "pending" || p.Status == "completed"));
        if (activeExists)
            return new ApiResponse<PaymentDetailDto>("duplicate_payment",
                new { error = "An active payment already exists for this enrollment." });

        if (dto.Notes is not null)
            Console.WriteLine($"[Payment] Notes for enrollment {dto.EnrollmentId}: {dto.Notes}");

        var payment = new Payment
        {
            StudentId = dto.StudentId,
            EnrollmentId = dto.EnrollmentId,
            Amount = dto.Amount,
            Currency = string.IsNullOrWhiteSpace(dto.Currency) ? "PKR" : dto.Currency,
            Method = dto.Method,
            PaidAt = DateTime.UtcNow,
            Status = "pending"
        };

        db.Payments.Add(payment);
        await db.SaveChangesAsync();

        // Reload with navigation for response
        var created = await db.Payments.AsNoTracking()
            .Include(p => p.Student)
            .Include(p => p.Enrollment)
                .ThenInclude(e => e.Course)
            .FirstAsync(p => p.PaymentId == payment.PaymentId);

        return new ApiResponse<PaymentDetailDto>(MapToDetailDto(created));
    }

    // ── PATCH STATUS (state machine) ──────────────────────────────────────────

    public async Task<ApiResponse<PaymentListItemDto>> PatchPaymentStatusAsync(
        int paymentId, PaymentStatusPatchDto dto, string? callerRole)
    {
        using var tx = await db.Database.BeginTransactionAsync();

        var payment = await db.Payments
            .Include(p => p.Student)
            .Include(p => p.Enrollment)
            .FirstOrDefaultAsync(p => p.PaymentId == paymentId);

        if (payment is null)
        {
            await tx.RollbackAsync();
            return new ApiResponse<PaymentListItemDto>("Payment not found.");
        }

        var current = payment.Status;
        var next = dto.Status;

        var allowed = IsValidTransition(current, next, callerRole);
        if (!allowed)
        {
            await tx.RollbackAsync();
            if (current == "completed" && next == "refunded" && !IsSuperAdmin(callerRole))
                return new ApiResponse<PaymentListItemDto>("Only super_admin can issue refunds.");
            return new ApiResponse<PaymentListItemDto>(
                $"Transition from '{current}' to '{next}' is not allowed.");
        }

        if (dto.Notes is not null)
            Console.WriteLine($"[Payment {paymentId}] Status change {current}→{next}. Notes: {dto.Notes}");

        payment.Status = next;

        // Side effect: auto-activate enrollment when payment completes
        if (next == "completed" && payment.Enrollment.Status != "active")
            payment.Enrollment.Status = "active";

        await db.SaveChangesAsync();
        await tx.CommitAsync();

        return new ApiResponse<PaymentListItemDto>(MapToSummaryDto(payment));
    }

    // ── ANALYTICS (SuperAdmin only) ───────────────────────────────────────────

    public async Task<ApiResponse<PaymentAnalyticsDto>> GetPaymentSummaryAsync()
    {
        var all = await db.Payments.AsNoTracking().ToListAsync();

        var allTime = new AllTimeSummaryDto
        {
            TotalPayments = all.Count,
            TotalRevenue = all.Where(p => p.Status == "completed").Sum(p => p.Amount),
            ByMethod = all.GroupBy(p => p.Method)
                          .ToDictionary(g => g.Key, g => g.Count()),
            ByStatus = all.GroupBy(p => p.Status)
                          .ToDictionary(g => g.Key, g => g.Count())
        };

        var monthly = all
            .GroupBy(p => new { p.PaidAt.Year, p.PaidAt.Month })
            .OrderByDescending(g => g.Key.Year).ThenByDescending(g => g.Key.Month)
            .Select(g => new MonthlyPaymentDto
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                TotalPayments = g.Count(),
                TotalRevenue = g.Where(p => p.Status == "completed").Sum(p => p.Amount),
                ByMethod = g.GroupBy(p => p.Method).ToDictionary(m => m.Key, m => m.Count()),
                ByStatus = g.GroupBy(p => p.Status).ToDictionary(s => s.Key, s => s.Count())
            }).ToList();

        return new ApiResponse<PaymentAnalyticsDto>(new PaymentAnalyticsDto
        {
            AllTime = allTime,
            Monthly = monthly
        });
    }

    // ── State Machine ─────────────────────────────────────────────────────────

    private static bool IsValidTransition(string current, string next, string? callerRole) =>
        (current, next) switch
        {
            ("pending", "completed") => true,
            ("pending", "failed")    => true,
            ("completed", "refunded") => IsSuperAdmin(callerRole),
            ("failed", "pending")    => true,
            _ => false
        };

    // ── Mappers ───────────────────────────────────────────────────────────────

    private static PaymentListItemDto MapToSummaryDto(Payment p) => new()
    {
        PaymentId = p.PaymentId,
        StudentId = p.StudentId,
        StudentName = p.Student?.FullName ?? "",
        EnrollmentId = p.EnrollmentId,
        Amount = p.Amount,
        Currency = p.Currency,
        Method = p.Method,
        PaidAt = p.PaidAt,
        Status = p.Status
    };

    private static PaymentDetailDto MapToDetailDto(Payment p) => new()
    {
        PaymentId = p.PaymentId,
        StudentId = p.StudentId,
        StudentName = p.Student?.FullName ?? "",
        EnrollmentId = p.EnrollmentId,
        Amount = p.Amount,
        Currency = p.Currency,
        Method = p.Method,
        PaidAt = p.PaidAt,
        Status = p.Status,
        Student = new PaymentStudentInfoDto
        {
            StudentId = p.StudentId,
            StudentName = p.Student?.FullName ?? "",
            GuardianPhone = p.Student?.GuardianPhone ?? ""
        },
        Enrollment = new PaymentEnrollmentInfoDto
        {
            EnrollmentId = p.EnrollmentId,
            CourseTitle = p.Enrollment?.Course?.Title ?? "",
            Status = p.Enrollment?.Status ?? ""
        }
    };
}

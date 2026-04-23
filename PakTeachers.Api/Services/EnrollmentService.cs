using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;

namespace PakTeachers.Api.Services;

public class EnrollmentService(PakTeachersDbContext db) : IEnrollmentService
{
    private static readonly HashSet<string> AdminRoles =
        new(StringComparer.OrdinalIgnoreCase) { "super_admin", "admin", "support" };

    private static bool IsAdmin(string? role) => role is not null && AdminRoles.Contains(role);
    private static bool IsTeacher(string? role) => "teacher".Equals(role, StringComparison.OrdinalIgnoreCase);
    private static bool IsStudent(string? role) => "student".Equals(role, StringComparison.OrdinalIgnoreCase);

    // ── GET LIST ──────────────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<EnrollmentSummaryDto>>> GetEnrollmentsAsync(
        string? statusFilter, int? courseId, int? studentId, string? paymentStatus,
        int page, int pageSize, string? callerRole, int callerId)
    {
        var query = db.Enrollments.AsNoTracking()
            .Include(e => e.Student)
            .Include(e => e.Course)
            .Include(e => e.Payments)
            .AsQueryable();

        // Teachers only see enrollments for their own courses
        if (IsTeacher(callerRole))
            query = query.Where(e => e.Course.TeacherId == callerId);
        else if (IsStudent(callerRole))
            query = query.Where(e => e.StudentId == callerId);

        if (statusFilter is not null)
            query = query.Where(e => e.Status == statusFilter);
        if (courseId.HasValue)
            query = query.Where(e => e.CourseId == courseId.Value);
        if (studentId.HasValue)
            query = query.Where(e => e.StudentId == studentId.Value);
        if (paymentStatus is not null)
            query = query.Where(e => e.Payments.Any(p => p.Status == paymentStatus));

        var items = await query
            .OrderByDescending(e => e.EnrolledDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(e => new EnrollmentSummaryDto
            {
                EnrollmentId = e.EnrollmentId,
                StudentId = e.StudentId,
                StudentName = e.Student.FullName,
                CourseId = e.CourseId,
                CourseTitle = e.Course.Title,
                EnrolledDate = e.EnrolledDate,
                Status = e.Status,
                PaymentStatus = e.Payments.OrderByDescending(p => p.PaidAt)
                    .Select(p => p.Status).FirstOrDefault() ?? "none"
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<EnrollmentSummaryDto>>(items);
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    public async Task<ApiResponse<EnrollmentDetailDto>> GetEnrollmentAsync(
        int enrollmentId, string? callerRole, int callerId)
    {
        var enrollment = await db.Enrollments.AsNoTracking()
            .Include(e => e.Student)
            .Include(e => e.Course)
            .Include(e => e.Payments)
            .FirstOrDefaultAsync(e => e.EnrollmentId == enrollmentId);

        if (enrollment is null)
            return new ApiResponse<EnrollmentDetailDto>("Enrollment not found.");

        // Access control
        if (IsTeacher(callerRole) && enrollment.Course.TeacherId != callerId)
            return new ApiResponse<EnrollmentDetailDto>("Enrollment not found.");
        if (IsStudent(callerRole) && enrollment.StudentId != callerId)
            return new ApiResponse<EnrollmentDetailDto>("Enrollment not found.");

        bool includePayments = IsAdmin(callerRole);

        var latestPayment = enrollment.Payments.OrderByDescending(p => p.PaidAt).FirstOrDefault();

        return new ApiResponse<EnrollmentDetailDto>(new EnrollmentDetailDto
        {
            EnrollmentId = enrollment.EnrollmentId,
            StudentId = enrollment.StudentId,
            StudentName = enrollment.Student.FullName,
            CourseId = enrollment.CourseId,
            CourseTitle = enrollment.Course.Title,
            EnrolledDate = enrollment.EnrolledDate,
            Status = enrollment.Status,
            PaymentStatus = latestPayment?.Status ?? "none",
            Payments = includePayments
                ? enrollment.Payments.Select(p => new PaymentSummaryDto
                {
                    PaymentId = p.PaymentId,
                    Amount = p.Amount,
                    Currency = p.Currency,
                    Method = p.Method,
                    PaidAt = p.PaidAt,
                    Status = p.Status
                })
                : null
        });
    }

    // ── CREATE (transactional) ────────────────────────────────────────────────

    public async Task<ApiResponse<EnrollmentDetailDto>> CreateEnrollmentAsync(
        EnrollmentCreateDto dto, string callerRole, int callerId)
    {
        var student = await db.Students.AsNoTracking()
            .FirstOrDefaultAsync(s => s.StudentId == dto.StudentId);
        if (student is null)
            return new ApiResponse<EnrollmentDetailDto>("Student not found.");
        if (student.Status != "active")
            return new ApiResponse<EnrollmentDetailDto>("Student is not active.");

        var course = await db.Courses.AsNoTracking()
            .FirstOrDefaultAsync(c => c.CourseId == dto.CourseId);
        if (course is null)
            return new ApiResponse<EnrollmentDetailDto>("Course not found.");
        if (course.Status != "active")
            return new ApiResponse<EnrollmentDetailDto>("Course is not active.");

        // Grade level match
        if (course.GradeLevel is not null &&
            !course.GradeLevel.Equals(student.GradeLevel, StringComparison.OrdinalIgnoreCase))
            return new ApiResponse<EnrollmentDetailDto>(
                $"Student grade level '{student.GradeLevel}' does not match course grade level '{course.GradeLevel}'.");

        // Duplicate active enrollment check
        bool duplicate = await db.Enrollments.AsNoTracking()
            .AnyAsync(e => e.StudentId == dto.StudentId && e.CourseId == dto.CourseId && e.Status == "active");
        if (duplicate)
            return new ApiResponse<EnrollmentDetailDto>("Student already has an active enrollment in this course.");

        await using var tx = await db.Database.BeginTransactionAsync();
        try
        {
            var enrollment = new Enrollment
            {
                StudentId = dto.StudentId,
                CourseId = dto.CourseId,
                EnrolledDate = DateOnly.FromDateTime(DateTime.UtcNow),
                Status = "active"
            };
            db.Enrollments.Add(enrollment);
            await db.SaveChangesAsync();

            var payment = new Payment
            {
                StudentId = dto.StudentId,
                EnrollmentId = enrollment.EnrollmentId,
                Amount = dto.Amount,
                Currency = dto.Currency,
                Method = dto.Method,
                PaidAt = DateTime.UtcNow,
                Status = "pending"
            };
            db.Payments.Add(payment);
            await db.SaveChangesAsync();

            await tx.CommitAsync();

            return new ApiResponse<EnrollmentDetailDto>(new EnrollmentDetailDto
            {
                EnrollmentId = enrollment.EnrollmentId,
                StudentId = enrollment.StudentId,
                StudentName = student.FullName,
                CourseId = enrollment.CourseId,
                CourseTitle = course.Title,
                EnrolledDate = enrollment.EnrolledDate,
                Status = enrollment.Status,
                PaymentStatus = payment.Status,
                Payments = [new PaymentSummaryDto
                {
                    PaymentId = payment.PaymentId,
                    Amount = payment.Amount,
                    Currency = payment.Currency,
                    Method = payment.Method,
                    PaidAt = payment.PaidAt,
                    Status = payment.Status
                }]
            });
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> UpdateEnrollmentStatusAsync(
        int enrollmentId, EnrollmentStatusUpdateDto dto, string callerRole, int callerId)
    {
        var enrollment = await db.Enrollments
            .Include(e => e.Course)
            .FirstOrDefaultAsync(e => e.EnrollmentId == enrollmentId);

        if (enrollment is null)
            return new ApiResponse<object>("Enrollment not found.");

        if (IsTeacher(callerRole) && enrollment.Course.TeacherId != callerId)
            return new ApiResponse<object>("Enrollment not found.");
        if (IsStudent(callerRole) && enrollment.StudentId != callerId)
            return new ApiResponse<object>("Enrollment not found.");

        var newStatus = dto.Status.ToLowerInvariant();

        if (enrollment.Status != "active")
            return new ApiResponse<object>($"Cannot change status from '{enrollment.Status}'.");

        if (newStatus != "dropped" && newStatus != "completed")
            return new ApiResponse<object>("Status must be 'dropped' or 'completed'.");

        var warnings = new List<string>();

        if (newStatus == "completed" && enrollment.Course.Status == "active")
            warnings.Add("Course is still active; completing enrollment early.");

        enrollment.Status = newStatus;
        await db.SaveChangesAsync();

        var response = new ApiResponse<object>(new { }, $"Enrollment marked as {newStatus}.");
        if (warnings.Count > 0)
            response.Warnings = warnings;

        return response;
    }
}

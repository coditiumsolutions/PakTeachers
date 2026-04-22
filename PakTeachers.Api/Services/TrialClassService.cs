using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;

namespace PakTeachers.Api.Services;

public class TrialClassService(PakTeachersDbContext db) : ITrialClassService
{
    private static readonly HashSet<string> AdminRoles =
        new(StringComparer.OrdinalIgnoreCase) { "super_admin", "admin", "support" };

    private static readonly HashSet<string> AcademicSubjects =
        new(StringComparer.OrdinalIgnoreCase)
        {
            "math", "mathematics", "science", "english", "urdu", "islamiat",
            "physics", "chemistry", "biology", "history", "geography",
            "computer science", "accounts", "economics", "statistics"
        };

    private static bool IsAdmin(string? role) => role is not null && AdminRoles.Contains(role);
    private static bool IsTeacher(string? role) => "teacher".Equals(role, StringComparison.OrdinalIgnoreCase);
    private static bool IsStudent(string? role) => "student".Equals(role, StringComparison.OrdinalIgnoreCase);

    // ── GET LIST ──────────────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<TrialClassSummaryDto>>> GetTrialClassesAsync(
        string? statusFilter, bool? converted, int? teacherId,
        string? callerRole, int callerId)
    {
        var query = db.TrialClasses.AsNoTracking()
            .Include(t => t.Student)
            .Include(t => t.Teacher)
            .AsQueryable();

        if (IsTeacher(callerRole))
            query = query.Where(t => t.TeacherId == callerId);
        else if (IsStudent(callerRole))
            query = query.Where(t => t.StudentId == callerId);
        else if (teacherId.HasValue)
            query = query.Where(t => t.TeacherId == teacherId.Value);

        if (statusFilter is not null)
            query = query.Where(t => t.Status == statusFilter);
        if (converted.HasValue)
            query = query.Where(t => t.Converted == converted.Value);

        var items = await query
            .OrderByDescending(t => t.ScheduledAt)
            .Select(t => new TrialClassSummaryDto
            {
                TrialId = t.TrialId,
                StudentId = t.StudentId,
                StudentName = t.Student.FullName,
                TeacherId = t.TeacherId,
                TeacherName = t.Teacher.FullName,
                Subject = t.Subject,
                ScheduledAt = t.ScheduledAt,
                Status = t.Status,
                Converted = t.Converted
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<TrialClassSummaryDto>>(items);
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    public async Task<ApiResponse<TrialClassDetailDto>> GetTrialClassAsync(
        int trialId, string? callerRole, int callerId)
    {
        var trial = await db.TrialClasses.AsNoTracking()
            .Include(t => t.Student)
            .Include(t => t.Teacher)
            .FirstOrDefaultAsync(t => t.TrialId == trialId);

        if (trial is null)
            return new ApiResponse<TrialClassDetailDto>("Trial class not found.");

        if (IsTeacher(callerRole) && trial.TeacherId != callerId)
            return new ApiResponse<TrialClassDetailDto>("Trial class not found.");
        if (IsStudent(callerRole) && trial.StudentId != callerId)
            return new ApiResponse<TrialClassDetailDto>("Trial class not found.");

        bool includeGuardianInfo = IsAdmin(callerRole);

        return new ApiResponse<TrialClassDetailDto>(new TrialClassDetailDto
        {
            TrialId = trial.TrialId,
            StudentId = trial.StudentId,
            StudentName = trial.Student.FullName,
            TeacherId = trial.TeacherId,
            TeacherName = trial.Teacher.FullName,
            Subject = trial.Subject,
            ScheduledAt = trial.ScheduledAt,
            Status = trial.Status,
            Converted = trial.Converted,
            Feedback = trial.Feedback,
            GuardianName = includeGuardianInfo ? trial.Student.GuardianName : null,
            GuardianPhone = includeGuardianInfo ? trial.Student.GuardianPhone : null
        });
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<TrialClassDetailDto>> CreateTrialClassAsync(
        TrialClassCreateDto dto, string callerRole, int callerId)
    {
        var teacher = await db.Teachers.AsNoTracking()
            .FirstOrDefaultAsync(t => t.TeacherId == dto.TeacherId);
        if (teacher is null)
            return new ApiResponse<TrialClassDetailDto>("Teacher not found.");
        if (teacher.Status != "active")
            return new ApiResponse<TrialClassDetailDto>("Teacher is not active.");

        var student = await db.Students.AsNoTracking()
            .FirstOrDefaultAsync(s => s.StudentId == dto.StudentId);
        if (student is null)
            return new ApiResponse<TrialClassDetailDto>("Student not found.");
        if (student.Status != "active")
            return new ApiResponse<TrialClassDetailDto>("Student is not active.");

        // Academic subjects cannot be booked with a Quran teacher
        if (AcademicSubjects.Contains(dto.Subject) &&
            "quran".Equals(teacher.TeacherType, StringComparison.OrdinalIgnoreCase))
            return new ApiResponse<TrialClassDetailDto>(
                "Cannot book an academic subject with a Quran teacher.");

        // Academic subjects require academic teacher_type in general
        if (AcademicSubjects.Contains(dto.Subject) &&
            !"academic".Equals(teacher.TeacherType, StringComparison.OrdinalIgnoreCase))
            return new ApiResponse<TrialClassDetailDto>(
                $"Subject '{dto.Subject}' requires an academic teacher, but teacher type is '{teacher.TeacherType}'.");

        // Double-booking check: teacher must not have another trial or live session at same time
        bool trialConflict = await db.TrialClasses.AsNoTracking()
            .AnyAsync(t => t.TeacherId == dto.TeacherId &&
                           t.ScheduledAt == dto.ScheduledAt &&
                           t.Status != "cancelled");

        bool liveSessionConflict = await db.LiveSessions.AsNoTracking()
            .AnyAsync(s => s.TeacherId == dto.TeacherId &&
                           s.ScheduledAt == dto.ScheduledAt &&
                           s.Status != "cancelled");

        if (trialConflict || liveSessionConflict)
            return new ApiResponse<TrialClassDetailDto>(
                "Teacher already has a session scheduled at that time.");

        var trial = new TrialClass
        {
            StudentId = dto.StudentId,
            TeacherId = dto.TeacherId,
            Subject = dto.Subject,
            ScheduledAt = dto.ScheduledAt,
            Status = "pending",
            Converted = false
        };

        db.TrialClasses.Add(trial);
        try
        {
            await db.SaveChangesAsync();
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
        {
            var inner = ex.InnerException?.Message ?? ex.Message;
            return new ApiResponse<TrialClassDetailDto>($"Database error: {inner}");
        }

        bool includeGuardianInfo = IsAdmin(callerRole);

        return new ApiResponse<TrialClassDetailDto>(new TrialClassDetailDto
        {
            TrialId = trial.TrialId,
            StudentId = trial.StudentId,
            StudentName = student.FullName,
            TeacherId = trial.TeacherId,
            TeacherName = teacher.FullName,
            Subject = trial.Subject,
            ScheduledAt = trial.ScheduledAt,
            Status = trial.Status,
            Converted = trial.Converted,
            Feedback = null,
            GuardianName = includeGuardianInfo ? student.GuardianName : null,
            GuardianPhone = includeGuardianInfo ? student.GuardianPhone : null
        });
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> UpdateTrialClassStatusAsync(
        int trialId, TrialClassStatusUpdateDto dto, string callerRole, int callerId)
    {
        var trial = await db.TrialClasses
            .FirstOrDefaultAsync(t => t.TrialId == trialId);

        if (trial is null)
            return new ApiResponse<object>("Trial class not found.");

        // Teachers can only update their own; students cannot update status
        if (IsTeacher(callerRole) && trial.TeacherId != callerId)
            return new ApiResponse<object>("Trial class not found.");
        if (IsStudent(callerRole))
            return new ApiResponse<object>("Students cannot update trial class status.");

        if (trial.Status is "completed" or "cancelled")
            return new ApiResponse<object>($"Trial class is already '{trial.Status}' and cannot be changed.");

        var newStatus = dto.Status.ToLowerInvariant();

        if (newStatus != "completed" && newStatus != "cancelled")
            return new ApiResponse<object>("Status must be 'completed' or 'cancelled'.");

        // Only assigned teacher or admins can mark completed
        if (newStatus == "completed" && IsTeacher(callerRole) && trial.TeacherId != callerId)
            return new ApiResponse<object>("Only the assigned teacher can mark the trial as completed.");

        trial.Status = newStatus;
        if (newStatus == "completed" && dto.Feedback is not null)
            trial.Feedback = dto.Feedback;

        await db.SaveChangesAsync();
        return new ApiResponse<object>(new { }, $"Trial class marked as {newStatus}.");
    }

    // ── CONVERT ───────────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> ConvertTrialClassAsync(
        int trialId, TrialClassConvertDto dto, string callerRole, int callerId)
    {
        var trial = await db.TrialClasses
            .Include(t => t.Student)
            .FirstOrDefaultAsync(t => t.TrialId == trialId);

        if (trial is null)
            return new ApiResponse<object>("Trial class not found.");

        if (IsTeacher(callerRole) && trial.TeacherId != callerId)
            return new ApiResponse<object>("Trial class not found.");

        if (trial.Converted)
            return new ApiResponse<object>("Trial class is already converted.");

        if (!dto.CreateEnrollment)
        {
            trial.Converted = true;
            await db.SaveChangesAsync();
            return new ApiResponse<object>(new { }, "Trial class marked as converted.");
        }

        // Enrollment creation requires course details
        if (!dto.CourseId.HasValue || !dto.Amount.HasValue || dto.Method is null)
            return new ApiResponse<object>("CourseId, Amount, and Method are required to create an enrollment.");

        var course = await db.Courses.AsNoTracking()
            .FirstOrDefaultAsync(c => c.CourseId == dto.CourseId.Value);
        if (course is null)
            return new ApiResponse<object>("Course not found.");
        if (course.Status != "active")
            return new ApiResponse<object>("Course is not active.");

        var student = trial.Student;
        if (student.Status != "active")
            return new ApiResponse<object>("Student is not active.");

        if (course.GradeLevel is not null &&
            !course.GradeLevel.Equals(student.GradeLevel, StringComparison.OrdinalIgnoreCase))
            return new ApiResponse<object>(
                $"Student grade level '{student.GradeLevel}' does not match course grade level '{course.GradeLevel}'.");

        bool duplicate = await db.Enrollments.AsNoTracking()
            .AnyAsync(e => e.StudentId == trial.StudentId && e.CourseId == dto.CourseId.Value && e.Status == "active");
        if (duplicate)
            return new ApiResponse<object>("Student already has an active enrollment in this course.");

        await using var tx = await db.Database.BeginTransactionAsync();
        try
        {
            var enrollment = new Enrollment
            {
                StudentId = trial.StudentId,
                CourseId = dto.CourseId.Value,
                EnrolledDate = DateOnly.FromDateTime(DateTime.UtcNow),
                Status = "active"
            };
            db.Enrollments.Add(enrollment);
            await db.SaveChangesAsync();

            var payment = new Payment
            {
                StudentId = trial.StudentId,
                EnrollmentId = enrollment.EnrollmentId,
                Amount = dto.Amount.Value,
                Currency = dto.Currency ?? "PKR",
                Method = dto.Method,
                PaidAt = DateTime.UtcNow,
                Status = "pending"
            };
            db.Payments.Add(payment);

            trial.Converted = true;
            await db.SaveChangesAsync();

            await tx.CommitAsync();
            return new ApiResponse<object>(
                new { EnrollmentId = enrollment.EnrollmentId, PaymentId = payment.PaymentId },
                "Trial class converted and enrollment created.");
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }
}

using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;

namespace PakTeachers.Api.Services;

public class StudentService(PakTeachersDbContext db) : IStudentService
{
    private static readonly HashSet<string> ValidStatuses =
        new(StringComparer.OrdinalIgnoreCase) { "active", "inactive", "graduated" };

    // ── CREATE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<StudentResponseDTO>> CreateStudentAsync(StudentCreateDTO dto, int createdBy)
    {
        if (dto.Email is not null && await db.Students.AnyAsync(s => s.Email == dto.Email))
            return new ApiResponse<StudentResponseDTO>("A student with this email is already registered.");

        var username = await GenerateUniqueUsernameAsync(dto.FullName);
        var plainPassword = GenerateSecurePassword();
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword, workFactor: 11);

        var student = new Student
        {
            FullName = dto.FullName,
            Email = dto.Email,
            GuardianName = dto.GuardianName,
            GuardianPhone = dto.GuardianPhone,
            GradeLevel = dto.GradeLevel,
            City = dto.City,
            Username = username,
            PasswordHash = passwordHash,
            Status = dto.Status,
            CreatedBy = createdBy,
            EnrolledDate = DateOnly.FromDateTime(DateTime.UtcNow)
        };

        db.Students.Add(student);
        await db.SaveChangesAsync();

        var responseDto = MapToResponseDTO(student);
        responseDto.PlainPassword = plainPassword;
        return new ApiResponse<StudentResponseDTO>(responseDto,
            "Student created. Share the credentials with the student/guardian — the password will not be shown again.");
    }

    // ── LIST ──────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<StudentResponseDTO>>> GetStudentsAsync(
        string? grade, string? status, string? search)
    {
        var query = db.Students.AsQueryable();
        if (!string.IsNullOrWhiteSpace(grade))
            query = query.Where(s => s.GradeLevel == grade);
        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(s => s.Status == status);
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(s => s.FullName.Contains(search));

        var students = await query.ToListAsync();
        return new ApiResponse<IEnumerable<StudentResponseDTO>>(students.Select(MapToResponseDTO));
    }

    // ── EXISTS ────────────────────────────────────────────────────────────────

    public Task<bool> StudentExistsAsync(int studentId)
        => db.Students.AnyAsync(s => s.StudentId == studentId);

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    public async Task<StudentAdminResponseDTO?> GetStudentAdminAsync(int studentId)
    {
        var s = await db.Students.FindAsync(studentId);
        return s is null ? null : MapToAdminDTO(s);
    }

    public async Task<StudentSelfResponseDTO?> GetStudentSelfAsync(int studentId)
    {
        var s = await db.Students.FindAsync(studentId);
        return s is null ? null : MapToSelfDTO(s);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<StudentAdminResponseDTO>> UpdateStudentAsync(
        int studentId, StudentUpdateDTO dto, bool callerIsAdmin)
    {
        var student = await db.Students.FindAsync(studentId);
        if (student is null)
            return new ApiResponse<StudentAdminResponseDTO>("Student not found.");

        if (dto.Email is not null && dto.Email != student.Email
            && await db.Students.AnyAsync(s => s.Email == dto.Email && s.StudentId != studentId))
            return new ApiResponse<StudentAdminResponseDTO>("A student with this email is already registered.");

        List<string> warnings = [];

        var newGrade = callerIsAdmin ? dto.GradeLevel : null;
        if (newGrade is not null && newGrade != student.GradeLevel)
        {
            var mismatchedEnrollments = await db.Enrollments
                .Where(e => e.StudentId == studentId
                         && e.Status == "active"
                         && e.Course.GradeLevel != newGrade)
                .Select(e => new { e.EnrollmentId, e.Course.GradeLevel, e.Course.Title })
                .ToListAsync();

            foreach (var e in mismatchedEnrollments)
                warnings.Add(
                    $"Enrollment #{e.EnrollmentId} ({e.Title}) is for grade '{e.GradeLevel}', not '{newGrade}'.");
        }

        if (dto.FullName is not null) student.FullName = dto.FullName;
        if (dto.Email is not null) student.Email = dto.Email;
        if (dto.GuardianName is not null) student.GuardianName = dto.GuardianName;
        if (dto.GuardianPhone is not null) student.GuardianPhone = dto.GuardianPhone;
        if (newGrade is not null) student.GradeLevel = newGrade;
        if (dto.City is not null) student.City = dto.City;

        await db.SaveChangesAsync();

        return new ApiResponse<StudentAdminResponseDTO>(MapToAdminDTO(student), "Student updated.")
        {
            Warnings = warnings.Count > 0 ? warnings : null
        };
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<StudentAdminResponseDTO>> UpdateStudentStatusAsync(
        int studentId, string newStatus)
    {
        if (!ValidStatuses.Contains(newStatus))
            return new ApiResponse<StudentAdminResponseDTO>(
                $"Invalid status. Allowed values: {string.Join(", ", ValidStatuses)}.");

        var student = await db.Students.FindAsync(studentId);
        if (student is null)
            return new ApiResponse<StudentAdminResponseDTO>("Student not found.");

        List<string> warnings = [];

        if (newStatus.Equals("inactive", StringComparison.OrdinalIgnoreCase)
         || newStatus.Equals("graduated", StringComparison.OrdinalIgnoreCase))
        {
            var activeEnrollmentIds = await db.Enrollments
                .Where(e => e.StudentId == studentId && e.Status == "active")
                .Select(e => e.EnrollmentId)
                .ToListAsync();

            foreach (var eid in activeEnrollmentIds)
                warnings.Add($"Enrollment #{eid} is still active.");
        }

        student.Status = newStatus;
        await db.SaveChangesAsync();

        return new ApiResponse<StudentAdminResponseDTO>(MapToAdminDTO(student), $"Status updated to '{newStatus}'.")
        {
            Warnings = warnings.Count > 0 ? warnings : null
        };
    }

    // ── ENROLLMENTS ───────────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<EnrollmentResponseDTO>>> GetEnrollmentsAsync(
        int studentId, string? status)
    {
        var query = db.Enrollments
            .Where(e => e.StudentId == studentId);

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(e => e.Status == status);

        var result = await query
            .Select(e => new EnrollmentResponseDTO
            {
                EnrollmentId = e.EnrollmentId,
                CourseId = e.CourseId,
                CourseTitle = e.Course.Title,
                CourseGradeLevel = e.Course.GradeLevel,
                CourseStatus = e.Course.Status,
                EnrolledDate = e.EnrolledDate,
                Status = e.Status
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<EnrollmentResponseDTO>>(result);
    }

    // ── PROGRESS ──────────────────────────────────────────────────────────────

    public async Task<ApiResponse<ProgressResponseDTO>> GetProgressAsync(int studentId, int? enrollmentId)
    {
        var enrollmentQuery = db.Enrollments
            .Where(e => e.StudentId == studentId);

        if (enrollmentId.HasValue)
            enrollmentQuery = enrollmentQuery.Where(e => e.EnrollmentId == enrollmentId.Value);

        var enrollments = await enrollmentQuery
            .Select(e => new
            {
                e.EnrollmentId,
                e.CourseId,
                CourseTitle = e.Course.Title,
                Lessons = e.Course.Modules
                    .SelectMany(m => m.Lessons)
                    .Select(l => new
                    {
                        l.LessonId,
                        l.Title,
                        Progress = l.StudentProgresses
                            .Where(p => p.StudentId == studentId)
                            .Select(p => new { p.Status, p.CompletedAt, p.WatchTime })
                            .FirstOrDefault()
                    })
                    .ToList()
            })
            .ToListAsync();

        var courseDTOs = enrollments.Select(e =>
        {
            var total = e.Lessons.Count;
            var completed = e.Lessons.Count(l =>
                l.Progress?.Status.Equals("completed", StringComparison.OrdinalIgnoreCase) == true);

            return new CourseProgressDTO
            {
                EnrollmentId = e.EnrollmentId,
                CourseId = e.CourseId,
                CourseTitle = e.CourseTitle,
                TotalLessons = total,
                CompletedLessons = completed,
                CompletionPct = total == 0 ? 0 : (int)(completed * 100.0 / total),
                Lessons = e.Lessons.Select(l => new CourseLessonProgressDTO
                {
                    LessonId = l.LessonId,
                    LessonTitle = l.Title,
                    ProgressStatus = l.Progress?.Status ?? "not_started",
                    CompletedAt = l.Progress?.CompletedAt,
                    WatchTime = l.Progress?.WatchTime
                })
            };
        }).ToList();

        var allTotal = courseDTOs.Sum(c => c.TotalLessons);
        var allCompleted = courseDTOs.Sum(c => c.CompletedLessons);
        var overall = allTotal == 0 ? 0 : (int)(allCompleted * 100.0 / allTotal);

        return new ApiResponse<ProgressResponseDTO>(new ProgressResponseDTO
        {
            OverallCompletion = overall,
            Courses = courseDTOs
        });
    }

    // ── SUBMISSIONS ───────────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<SubmissionResponseDTO>>> GetSubmissionsAsync(int studentId)
    {
        var result = await db.AssessmentSubmissions
            .Where(s => s.StudentId == studentId)
            .OrderByDescending(s => s.SubmittedAt)
            .Select(s => new SubmissionResponseDTO
            {
                SubmissionId = s.SubmissionId,
                AssessmentId = s.AssessmentId,
                AssessmentType = s.Assessment.AssessmentType,
                ModuleTitle = s.Assessment.Module.Title,
                CourseTitle = s.Assessment.Module.Course.Title,
                Score = s.Score,
                TotalMarks = s.Assessment.TotalMarks,
                Passmarks = s.Assessment.Passmarks,
                Passed = s.Score == null ? null : s.Score >= s.Assessment.Passmarks,
                SubmittedAt = s.SubmittedAt,
                Feedback = s.Feedback
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<SubmissionResponseDTO>>(result);
    }

    // ── PAYMENTS ──────────────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<PaymentResponseDTO>>> GetPaymentsAsync(int studentId)
    {
        var result = await db.Payments
            .Where(p => p.StudentId == studentId)
            .OrderByDescending(p => p.PaidAt)
            .Select(p => new PaymentResponseDTO
            {
                PaymentId = p.PaymentId,
                EnrollmentId = p.EnrollmentId,
                CourseTitle = p.Enrollment.Course.Title,
                Amount = p.Amount,
                Currency = p.Currency,
                Method = p.Method,
                PaidAt = p.PaidAt,
                Status = p.Status
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<PaymentResponseDTO>>(result);
    }

    // ── DASHBOARD ─────────────────────────────────────────────────────────────

    public async Task<ApiResponse<StudentDashboardDTO>> GetStudentDashboardAsync(int studentId)
    {
        var now = DateTime.UtcNow;

        var activeEnrollments = await db.Enrollments
            .CountAsync(e => e.StudentId == studentId && e.Status == "active");

        var totalLessons = await db.Lessons
            .CountAsync(l => l.Module.Course.Enrollments
                .Any(e => e.StudentId == studentId && e.Status == "active"));

        var completedLessons = await db.StudentProgresses
            .CountAsync(p => p.StudentId == studentId && p.Status == "completed"
                && p.Lesson.Module.Course.Enrollments
                    .Any(e => e.StudentId == studentId && e.Status == "active"));

        var overallPct = totalLessons == 0 ? 0 : (int)(completedLessons * 100.0 / totalLessons);

        // Pending submissions: active assessments in enrolled courses with no submission yet
        var pendingSubmissions = await db.Assessments
            .CountAsync(a => a.Status == "active"
                && a.Module.Course.Enrollments.Any(e => e.StudentId == studentId && e.Status == "active")
                && !a.AssessmentSubmissions.Any(s => s.StudentId == studentId));

        // Upcoming sessions: from enrolled active courses
        var rawSessions = await db.LiveSessions
            .Where(s => s.ScheduledAt > now
                && s.Lesson.Module.Course.Enrollments
                    .Any(e => e.StudentId == studentId && e.Status == "active"))
            .OrderBy(s => s.ScheduledAt)
            .Take(5)
            .Select(s => new
            {
                s.SessionId,
                s.ScheduledAt,
                LessonTitle = s.Lesson.Title,
                CourseTitle = s.Lesson.Module.Course.Title,
                s.MeetingLink
            })
            .ToListAsync();

        var upcomingSessions = rawSessions.Select(s => new DashboardUpcomingSessionDTO
        {
            SessionId = s.SessionId,
            ScheduledAt = s.ScheduledAt,
            LessonTitle = s.LessonTitle,
            CourseTitle = s.CourseTitle,
            MeetingLink = (s.ScheduledAt - now).TotalMinutes <= 30 ? s.MeetingLink : null
        });

        // Recent grades: last 3 graded submissions
        var recentGrades = await db.AssessmentSubmissions
            .Where(s => s.StudentId == studentId && s.Score != null)
            .OrderByDescending(s => s.SubmittedAt)
            .Take(3)
            .Select(s => new RecentGradeDTO
            {
                SubmissionId = s.SubmissionId,
                AssessmentType = s.Assessment.AssessmentType,
                CourseTitle = s.Assessment.Module.Course.Title,
                Score = s.Score!.Value,
                TotalMarks = s.Assessment.TotalMarks,
                Passed = s.Score >= s.Assessment.Passmarks
            })
            .ToListAsync();

        // Pending payments
        var pendingPayments = await db.Payments
            .Where(p => p.StudentId == studentId && p.Status == "pending")
            .Select(p => new PendingPaymentDTO
            {
                PaymentId = p.PaymentId,
                CourseTitle = p.Enrollment.Course.Title,
                Amount = p.Amount,
                Currency = p.Currency
            })
            .ToListAsync();

        return new ApiResponse<StudentDashboardDTO>(new StudentDashboardDTO
        {
            ActiveEnrollments = activeEnrollments,
            OverallCompletionPct = overallPct,
            PendingSubmissions = pendingSubmissions,
            UpcomingSessions = upcomingSessions,
            RecentGrades = recentGrades,
            PendingPayments = pendingPayments
        });
    }

    // ── HELPERS ───────────────────────────────────────────────────────────────

    private async Task<string> GenerateUniqueUsernameAsync(string fullName)
    {
        var parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var first = Sanitize(parts[0]).ToLowerInvariant();
        var base_ = $"std.{first}";

        if (!await db.Students.AnyAsync(s => s.Username == base_))
            return base_;

        for (int i = 2; i <= 9999; i++)
        {
            var candidate = $"{base_}.{i}";
            if (!await db.Students.AnyAsync(s => s.Username == candidate))
                return candidate;
        }

        return $"{base_}.{RandomNumberGenerator.GetInt32(10000, 99999)}";
    }

    private static string Sanitize(string s)
        => new([.. s.Where(char.IsLetterOrDigit)]);

    private static string GenerateSecurePassword()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
        return new string(Enumerable.Range(0, 12)
            .Select(_ => chars[RandomNumberGenerator.GetInt32(chars.Length)])
            .ToArray());
    }

    private static StudentResponseDTO MapToResponseDTO(Student s) => new()
    {
        Id = s.StudentId,
        FullName = s.FullName,
        Email = s.Email,
        GuardianName = s.GuardianName,
        GuardianPhone = s.GuardianPhone,
        GradeLevel = s.GradeLevel,
        Username = s.Username,
        Status = s.Status,
        EnrolledDate = s.EnrolledDate,
        CreatedBy = s.CreatedBy
    };

    private static StudentAdminResponseDTO MapToAdminDTO(Student s) => new()
    {
        Id = s.StudentId,
        FullName = s.FullName,
        Email = s.Email,
        GuardianName = s.GuardianName,
        GuardianPhone = s.GuardianPhone,
        GradeLevel = s.GradeLevel,
        Username = s.Username,
        Status = s.Status,
        EnrolledDate = s.EnrolledDate,
        CreatedBy = s.CreatedBy
    };

    private static StudentSelfResponseDTO MapToSelfDTO(Student s) => new()
    {
        Id = s.StudentId,
        FullName = s.FullName,
        Email = s.Email,
        GuardianName = s.GuardianName,
        GradeLevel = s.GradeLevel,
        Username = s.Username,
        Status = s.Status,
        EnrolledDate = s.EnrolledDate
    };
}

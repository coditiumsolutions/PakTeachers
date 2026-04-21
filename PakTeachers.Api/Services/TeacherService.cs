using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;

namespace PakTeachers.Api.Services;

public class TeacherService(PakTeachersDbContext db) : ITeacherService
{
    public async Task<ApiResponse<TeacherResponseDTO>> CreateTeacherAsync(TeacherCreateDTO dto, int createdBy)
    {
        if (await db.Teachers.AnyAsync(t => t.Cnic == dto.Cnic))
            return new ApiResponse<TeacherResponseDTO>("A teacher with this CNIC is already registered.");

        var username = GenerateUsername(dto.FullName);
        var plainPassword = GenerateSecurePassword();
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword, workFactor: 11);

        var teacher = new Teacher
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            Cnic = dto.Cnic,
            Username = username,
            PasswordHash = passwordHash,
            TeacherType = dto.TeacherType,
            Specialization = dto.Specialization,
            Qualification = dto.Qualification,
            CreatedBy = createdBy,
            JoinedDate = DateOnly.FromDateTime(DateTime.UtcNow)
        };

        db.Teachers.Add(teacher);
        await db.SaveChangesAsync();

        return new ApiResponse<TeacherResponseDTO>(MapToFullDTO(teacher),
            $"Teacher created. Username: {username} | Temporary password: {plainPassword}");
    }

    public async Task<ApiResponse<IEnumerable<TeacherResponseDTO>>> GetTeachersFullAsync(string? type, string? status, string? search)
    {
        var query = db.Teachers.AsQueryable();
        if (!string.IsNullOrWhiteSpace(type))
            query = query.Where(t => t.TeacherType == type);
        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(t => t.Status == status);
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(t => t.FullName.Contains(search));

        var teachers = await query.ToListAsync();
        return new ApiResponse<IEnumerable<TeacherResponseDTO>>(teachers.Select(MapToFullDTO));
    }

    public async Task<ApiResponse<IEnumerable<TeacherPublicResponseDTO>>> GetTeachersPublicAsync(string? type, string? status, string? search)
    {
        var query = db.Teachers.AsQueryable();
        if (!string.IsNullOrWhiteSpace(type))
            query = query.Where(t => t.TeacherType == type);
        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(t => t.Status == status);
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(t => t.FullName.Contains(search));

        var teachers = await query.ToListAsync();
        return new ApiResponse<IEnumerable<TeacherPublicResponseDTO>>(teachers.Select(t => new TeacherPublicResponseDTO
        {
            Id = t.TeacherId,
            FullName = t.FullName,
            TeacherType = t.TeacherType,
            Specialization = t.Specialization,
            Status = t.Status
        }));
    }

    public Task<bool> TeacherExistsAsync(int teacherId)
        => db.Teachers.AnyAsync(t => t.TeacherId == teacherId);

    public async Task<ApiResponse<IEnumerable<TeacherCourseSummaryDTO>>> GetTeacherCoursesAsync(int teacherId)
    {
        var courses = await db.Courses
            .Where(c => c.TeacherId == teacherId)
            .Select(c => new TeacherCourseSummaryDTO
            {
                CourseId = c.CourseId,
                Title = c.Title,
                Status = c.Status,
                GradeLevel = c.GradeLevel,
                ModuleCount = c.Modules.Count,
                EnrolledStudentCount = c.Enrollments.Count
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<TeacherCourseSummaryDTO>>(courses);
    }

    public async Task<ApiResponse<IEnumerable<LiveSessionTeacherViewDTO>>> GetTeacherLiveSessionsAsync(int teacherId)
    {
        var now = DateTime.UtcNow;

        var sessions = await db.LiveSessions
            .Where(s => s.TeacherId == teacherId)
            .OrderBy(s => s.ScheduledAt)
            .Select(s => new
            {
                s.SessionId,
                s.ScheduledAt,
                LessonTitle = s.Lesson.Title,
                CourseTitle = s.Lesson.Module.Course.Title,
                s.Status,
                s.MeetingLink
            })
            .ToListAsync();

        var result = sessions.Select(s => new LiveSessionTeacherViewDTO
        {
            SessionId = s.SessionId,
            ScheduledAt = s.ScheduledAt,
            LessonTitle = s.LessonTitle,
            CourseTitle = s.CourseTitle,
            Status = s.Status,
            // Reveal link only when live or starting within 30 minutes
            MeetingLink = s.Status.Equals("live", StringComparison.OrdinalIgnoreCase)
                          || (s.ScheduledAt - now).TotalMinutes <= 30
                ? s.MeetingLink
                : null
        });

        return new ApiResponse<IEnumerable<LiveSessionTeacherViewDTO>>(result);
    }

    public async Task<ApiResponse<IEnumerable<TrialClassTeacherViewDTO>>> GetTeacherTrialClassesAsync(int teacherId)
    {
        var trials = await db.TrialClasses
            .Where(t => t.TeacherId == teacherId)
            .OrderByDescending(t => t.ScheduledAt)
            .Select(t => new TrialClassTeacherViewDTO
            {
                TrialId = t.TrialId,
                StudentName = t.Student.FullName,
                Subject = t.Subject,
                ScheduledAt = t.ScheduledAt,
                Status = t.Status,
                Feedback = t.Feedback,
                Converted = t.Converted
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<TrialClassTeacherViewDTO>>(trials);
    }

    public async Task<ApiResponse<TeacherDashboardDTO>> GetTeacherDashboardAsync(int teacherId, bool isAdmin)
    {
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var activeCourses = await db.Courses
            .CountAsync(c => c.TeacherId == teacherId && c.Status == "active");

        var totalStudents = await db.Enrollments
            .Where(e => e.Course.TeacherId == teacherId)
            .Select(e => e.StudentId)
            .Distinct()
            .CountAsync();

        var pendingTrials = await db.TrialClasses
            .CountAsync(t => t.TeacherId == teacherId && t.Status == "pending");

        var pendingSubmissions = await db.AssessmentSubmissions
            .CountAsync(s => s.Assessment.Module.Course.TeacherId == teacherId && s.Score == null);

        var completedThisMonth = await db.LiveSessions
            .CountAsync(s => s.TeacherId == teacherId
                          && s.Status == "completed"
                          && s.ScheduledAt >= monthStart);

        var upcomingSessions = await db.LiveSessions
            .Where(s => s.TeacherId == teacherId && s.ScheduledAt > now)
            .OrderBy(s => s.ScheduledAt)
            .Take(5)
            .Select(s => new UpcomingSessionDTO
            {
                SessionId = s.SessionId,
                ScheduledAt = s.ScheduledAt,
                LessonTitle = s.Lesson.Title,
                CourseTitle = s.Lesson.Module.Course.Title
            })
            .ToListAsync();

        var dashboard = new TeacherDashboardDTO
        {
            ActiveCoursesCount = activeCourses,
            TotalStudentsCount = totalStudents,
            PendingTrialsCount = pendingTrials,
            PendingSubmissionsCount = pendingSubmissions,
            CompletedSessionsThisMonth = completedThisMonth,
            UpcomingSessions = upcomingSessions,
            // LastLogin is not tracked in the current schema; always null until the field is added.
            LastLogin = null
        };

        return new ApiResponse<TeacherDashboardDTO>(dashboard);
    }

    private static string GenerateUsername(string fullName)
    {
        var parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var first = Sanitize(parts[0]);
        var last = parts.Length > 1 ? Sanitize(parts[^1]) : "";
        var base_ = string.IsNullOrEmpty(last) ? $"teacher.{first}" : $"teacher.{first}{last[0]}";
        return base_.ToLowerInvariant();
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

    private static TeacherResponseDTO MapToFullDTO(Teacher t) => new()
    {
        Id = t.TeacherId,
        FullName = t.FullName,
        Email = t.Email,
        Phone = t.Phone,
        Cnic = t.Cnic,
        Username = t.Username,
        TeacherType = t.TeacherType,
        Specialization = t.Specialization,
        Qualification = t.Qualification,
        Status = t.Status,
        JoinedDate = t.JoinedDate,
        CreatedBy = t.CreatedBy
    };
}

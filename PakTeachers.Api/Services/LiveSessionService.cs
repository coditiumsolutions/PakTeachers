using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;

namespace PakTeachers.Api.Services;

public class LiveSessionService(PakTeachersDbContext db) : ILiveSessionService
{
    private static readonly HashSet<string> AdminRoles =
        new(StringComparer.OrdinalIgnoreCase) { "super_admin", "admin", "support" };

    private static bool IsAdmin(string? role) => role is not null && AdminRoles.Contains(role);
    private static bool IsTeacher(string? role) => "teacher".Equals(role, StringComparison.OrdinalIgnoreCase);
    private static bool IsStudent(string? role) => "student".Equals(role, StringComparison.OrdinalIgnoreCase);

    private static bool IsWithinJoinWindow(DateTime scheduledAt, string status)
    {
        if (status == "live") return true;
        if (status != "scheduled") return false;
        var minutesUntilStart = (scheduledAt.ToUniversalTime() - DateTime.UtcNow).TotalMinutes;
        return minutesUntilStart <= 30;
    }

    // ── UPCOMING ──────────────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<LiveSessionSummaryDto>>> GetUpcomingSessionsAsync(
        string? callerRole, int callerId)
    {
        var query = db.LiveSessions.AsNoTracking()
            .Include(s => s.Lesson)
                .ThenInclude(l => l.Module)
                    .ThenInclude(m => m.Course)
            .Include(s => s.Teacher)
            .Where(s => s.Status == "scheduled" || s.Status == "live")
            .AsQueryable();

        if (IsTeacher(callerRole))
            query = query.Where(s => s.TeacherId == callerId);
        else if (IsStudent(callerRole))
            query = query.Where(s => db.Enrollments
                .Any(e => e.StudentId == callerId &&
                          e.CourseId == s.Lesson.Module.CourseId &&
                          e.Status == "active"));

        var items = await query
            .OrderBy(s => s.ScheduledAt)
            .Take(5)
            .Select(s => new LiveSessionSummaryDto
            {
                SessionId = s.SessionId,
                LessonId = s.LessonId,
                LessonTitle = s.Lesson.Title,
                TeacherId = s.TeacherId,
                TeacherName = s.Teacher.FullName,
                ScheduledAt = s.ScheduledAt,
                DurationMinutes = s.DurationMinutes,
                Status = s.Status
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<LiveSessionSummaryDto>>(items);
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    public async Task<ApiResponse<LiveSessionDetailDto>> GetSessionAsync(
        int sessionId, string? callerRole, int callerId)
    {
        var session = await db.LiveSessions.AsNoTracking()
            .Include(s => s.Lesson)
                .ThenInclude(l => l.Module)
                    .ThenInclude(m => m.Course)
            .Include(s => s.Teacher)
            .FirstOrDefaultAsync(s => s.SessionId == sessionId);

        if (session is null)
            return new ApiResponse<LiveSessionDetailDto>("Session not found.");

        if (IsStudent(callerRole))
        {
            bool enrolled = await db.Enrollments.AsNoTracking()
                .AnyAsync(e => e.StudentId == callerId &&
                               e.CourseId == session.Lesson.Module.CourseId &&
                               e.Status == "active");
            if (!enrolled)
                return new ApiResponse<LiveSessionDetailDto>("Session not found.");
        }
        else if (IsTeacher(callerRole) && session.TeacherId != callerId)
        {
            return new ApiResponse<LiveSessionDetailDto>("Session not found.");
        }

        bool showLink = IsAdmin(callerRole) || IsWithinJoinWindow(session.ScheduledAt, session.Status);

        return new ApiResponse<LiveSessionDetailDto>(new LiveSessionDetailDto
        {
            SessionId = session.SessionId,
            LessonId = session.LessonId,
            LessonTitle = session.Lesson.Title,
            CourseTitle = session.Lesson.Module.Course.Title,
            TeacherId = session.TeacherId,
            TeacherName = session.Teacher.FullName,
            ScheduledAt = session.ScheduledAt,
            DurationMinutes = session.DurationMinutes,
            Status = session.Status,
            MeetingLink = showLink ? session.MeetingLink : null,
            RecordingUrl = session.RecordingUrl
        });
    }

    // ── GET BY LESSON ─────────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<LiveSessionDetailDto>>> GetSessionsByLessonAsync(
        int lessonId, string? callerRole, int callerId)
    {
        var lesson = await db.Lessons.AsNoTracking()
            .Include(l => l.Module)
                .ThenInclude(m => m.Course)
            .FirstOrDefaultAsync(l => l.LessonId == lessonId);

        if (lesson is null)
            return new ApiResponse<IEnumerable<LiveSessionDetailDto>>("Lesson not found.");

        if (IsStudent(callerRole))
        {
            bool enrolled = await db.Enrollments.AsNoTracking()
                .AnyAsync(e => e.StudentId == callerId &&
                               e.CourseId == lesson.Module.CourseId &&
                               e.Status == "active");
            if (!enrolled)
                return new ApiResponse<IEnumerable<LiveSessionDetailDto>>("Lesson not found.");
        }
        else if (IsTeacher(callerRole) && lesson.Module.Course.TeacherId != callerId)
        {
            return new ApiResponse<IEnumerable<LiveSessionDetailDto>>("Lesson not found.");
        }

        bool isEnrolledOrOwner = IsStudent(callerRole) || IsTeacher(callerRole) || IsAdmin(callerRole);

        var sessions = await db.LiveSessions.AsNoTracking()
            .Include(s => s.Teacher)
            .Where(s => s.LessonId == lessonId)
            .OrderByDescending(s => s.ScheduledAt)
            .ToListAsync();

        var dtos = sessions.Select(s => new LiveSessionDetailDto
        {
            SessionId = s.SessionId,
            LessonId = s.LessonId,
            LessonTitle = lesson.Title,
            CourseTitle = lesson.Module.Course.Title,
            TeacherId = s.TeacherId,
            TeacherName = s.Teacher.FullName,
            ScheduledAt = s.ScheduledAt,
            DurationMinutes = s.DurationMinutes,
            Status = s.Status,
            MeetingLink = IsAdmin(callerRole) || IsWithinJoinWindow(s.ScheduledAt, s.Status)
                ? s.MeetingLink
                : null,
            RecordingUrl = isEnrolledOrOwner ? s.RecordingUrl : null
        });

        return new ApiResponse<IEnumerable<LiveSessionDetailDto>>(dtos);
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<LiveSessionDetailDto>> CreateSessionAsync(
        LiveSessionCreateDto dto, string callerRole, int callerId)
    {
        var lesson = await db.Lessons.AsNoTracking()
            .Include(l => l.Module)
                .ThenInclude(m => m.Course)
            .FirstOrDefaultAsync(l => l.LessonId == dto.LessonId);

        if (lesson is null)
            return new ApiResponse<LiveSessionDetailDto>("Lesson not found.");

        var teacher = await db.Teachers.AsNoTracking()
            .FirstOrDefaultAsync(t => t.TeacherId == dto.TeacherId);

        if (teacher is null)
            return new ApiResponse<LiveSessionDetailDto>("Teacher not found.");

        if (teacher.Status != "active")
            return new ApiResponse<LiveSessionDetailDto>("Teacher is not active.");

        // Conflict check against other live sessions and trial classes
        var sessionEnd = dto.ScheduledAt.AddMinutes(dto.DurationMinutes ?? 60);

        bool liveConflict = await db.LiveSessions.AsNoTracking()
            .AnyAsync(s => s.TeacherId == dto.TeacherId &&
                           s.Status != "cancelled" &&
                           s.ScheduledAt < sessionEnd &&
                           s.ScheduledAt.AddMinutes(s.DurationMinutes ?? 60) > dto.ScheduledAt);

        bool trialConflict = await db.TrialClasses.AsNoTracking()
            .AnyAsync(t => t.TeacherId == dto.TeacherId &&
                           t.Status != "cancelled" &&
                           t.ScheduledAt >= dto.ScheduledAt &&
                           t.ScheduledAt < sessionEnd);

        if (liveConflict || trialConflict)
            return new ApiResponse<LiveSessionDetailDto>(
                "Teacher already has a session scheduled that overlaps with this time window.");

        var session = new LiveSession
        {
            LessonId = dto.LessonId,
            TeacherId = dto.TeacherId,
            ScheduledAt = dto.ScheduledAt,
            DurationMinutes = dto.DurationMinutes,
            MeetingLink = dto.MeetingLink,
            Status = "scheduled"
        };

        db.LiveSessions.Add(session);
        await db.SaveChangesAsync();

        return new ApiResponse<LiveSessionDetailDto>(new LiveSessionDetailDto
        {
            SessionId = session.SessionId,
            LessonId = session.LessonId,
            LessonTitle = lesson.Title,
            CourseTitle = lesson.Module.Course.Title,
            TeacherId = session.TeacherId,
            TeacherName = teacher.FullName,
            ScheduledAt = session.ScheduledAt,
            DurationMinutes = session.DurationMinutes,
            Status = session.Status,
            MeetingLink = session.MeetingLink,
            RecordingUrl = null
        });
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> UpdateSessionStatusAsync(
        int sessionId, LiveSessionStatusUpdateDto dto, string callerRole, int callerId)
    {
        var session = await db.LiveSessions
            .FirstOrDefaultAsync(s => s.SessionId == sessionId);

        if (session is null)
            return new ApiResponse<object>("Session not found.");

        if (IsTeacher(callerRole) && session.TeacherId != callerId)
            return new ApiResponse<object>("Session not found.");

        var newStatus = dto.Status.ToLowerInvariant();
        var current = session.Status.ToLowerInvariant();

        switch ((current, newStatus))
        {
            case ("scheduled", "live"):
                if (DateTime.UtcNow < session.ScheduledAt.AddMinutes(-60))
                    return new ApiResponse<object>(
                        "Cannot go live more than 60 minutes before the scheduled time.");
                break;

            case ("live", "completed"):
                break; // always allowed

            case ("completed", "cancelled"):
                return new ApiResponse<object>("Cannot cancel a completed session.");

            default:
                return new ApiResponse<object>(
                    $"Transition from '{current}' to '{newStatus}' is not allowed.");
        }

        session.Status = newStatus;
        await db.SaveChangesAsync();
        return new ApiResponse<object>(new { }, $"Session status updated to '{newStatus}'.");
    }
}

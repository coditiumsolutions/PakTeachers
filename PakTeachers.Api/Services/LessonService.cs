using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;

namespace PakTeachers.Api.Services;

public class LessonService(PakTeachersDbContext db) : ILessonService
{
    public const string OwnershipDeniedMessage = "Access denied: you do not own this course.";

    private static readonly HashSet<string> AdminRoles =
        new(StringComparer.OrdinalIgnoreCase) { "super_admin", "admin", "support" };

    private static bool IsAdmin(string? role) =>
        role is not null && AdminRoles.Contains(role);

    private static bool IsTeacher(string? role) =>
        "teacher".Equals(role, StringComparison.OrdinalIgnoreCase);

    private static bool IsStudent(string? role) =>
        "student".Equals(role, StringComparison.OrdinalIgnoreCase);

    // ── GET LIST ──────────────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<LessonSummaryDto>>> GetLessonsAsync(
        int moduleId, string? callerRole, int callerId)
    {
        bool privileged = IsAdmin(callerRole) ||
            (IsTeacher(callerRole) && await db.Modules.AsNoTracking()
                .AnyAsync(m => m.ModuleId == moduleId && m.Course.TeacherId == callerId));

        var query = db.Lessons.AsNoTracking()
            .Where(l => l.ModuleId == moduleId);

        if (!privileged)
            query = query.Where(l => l.Status == "published");

        var items = await query
            .OrderBy(l => l.LessonId)
            .Select(l => new LessonSummaryDto
            {
                LessonId = l.LessonId,
                ModuleId = l.ModuleId,
                Title = l.Title,
                ContentType = l.ContentType,
                LearningTime = l.LearningTime,
                Date = l.Date,
                Status = l.Status
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<LessonSummaryDto>>(items);
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    public async Task<ApiResponse<LessonDetailDto>> GetLessonAsync(
        int lessonId, string? callerRole, int callerId)
    {
        var lesson = await db.Lessons.AsNoTracking()
            .Include(l => l.Module)
                .ThenInclude(m => m.Course)
            .FirstOrDefaultAsync(l => l.LessonId == lessonId);

        if (lesson is null)
            return new ApiResponse<LessonDetailDto>("Lesson not found.");

        bool isAdmin = IsAdmin(callerRole);
        bool isOwner = IsTeacher(callerRole) && lesson.Module.Course.TeacherId == callerId;
        bool privileged = isAdmin || isOwner;

        if (lesson.Status == "draft" && !privileged)
            return new ApiResponse<LessonDetailDto>("Lesson not found.");

        // Students: check active enrollment to decide whether to expose content_url
        string? contentUrl = lesson.ContentUrl;
        bool requiresEnrollment = false;

        if (IsStudent(callerRole))
        {
            int courseId = lesson.Module.CourseId;
            bool enrolled = await db.Enrollments.AsNoTracking()
                .AnyAsync(e => e.StudentId == callerId && e.CourseId == courseId && e.Status == "active");

            if (!enrolled)
            {
                contentUrl = null;
                requiresEnrollment = true;
            }
        }

        return new ApiResponse<LessonDetailDto>(new LessonDetailDto
        {
            LessonId = lesson.LessonId,
            ModuleId = lesson.ModuleId,
            Title = lesson.Title,
            ContentType = lesson.ContentType,
            ContentUrl = contentUrl,
            LearningTime = lesson.LearningTime,
            Date = lesson.Date,
            Status = lesson.Status,
            Notes = privileged ? lesson.Notes : null,
            RequiresEnrollment = requiresEnrollment
        });
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<LessonSummaryDto>> CreateLessonAsync(
        int moduleId, LessonCreateDto dto, string callerRole, int callerId)
    {
        var module = await db.Modules
            .Include(m => m.Course)
            .FirstOrDefaultAsync(m => m.ModuleId == moduleId);

        if (module is null)
            return new ApiResponse<LessonSummaryDto>("Module not found.");

        if (IsTeacher(callerRole) && module.Course.TeacherId != callerId)
            return new ApiResponse<LessonSummaryDto>(OwnershipDeniedMessage);

        var lesson = new Lesson
        {
            ModuleId = moduleId,
            Title = dto.Title,
            ContentType = dto.ContentType,
            ContentUrl = dto.ContentUrl,
            LearningTime = dto.LearningTime,
            Date = dto.Date,
            Notes = dto.Notes,
            Status = "draft"
        };

        db.Lessons.Add(lesson);
        await db.SaveChangesAsync();

        return new ApiResponse<LessonSummaryDto>(new LessonSummaryDto
        {
            LessonId = lesson.LessonId,
            ModuleId = lesson.ModuleId,
            Title = lesson.Title,
            ContentType = lesson.ContentType,
            LearningTime = lesson.LearningTime,
            Date = lesson.Date,
            Status = lesson.Status
        });
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> UpdateLessonAsync(
        int lessonId, LessonUpdateDto dto, string callerRole, int callerId)
    {
        var lesson = await db.Lessons
            .Include(l => l.Module)
                .ThenInclude(m => m.Course)
            .FirstOrDefaultAsync(l => l.LessonId == lessonId);

        if (lesson is null)
            return new ApiResponse<object>("Lesson not found.");

        if (IsTeacher(callerRole) && lesson.Module.Course.TeacherId != callerId)
            return new ApiResponse<object>(OwnershipDeniedMessage);

        // ContentType is locked — not updatable
        if (dto.Title is not null) lesson.Title = dto.Title;
        if (dto.ContentUrl is not null) lesson.ContentUrl = dto.ContentUrl;
        if (dto.LearningTime.HasValue) lesson.LearningTime = dto.LearningTime;
        if (dto.Date.HasValue) lesson.Date = dto.Date;
        if (dto.Notes is not null) lesson.Notes = dto.Notes;

        await db.SaveChangesAsync();
        return new ApiResponse<object>(new { }, "Lesson updated successfully.");
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> UpdateLessonStatusAsync(
        int lessonId, LessonStatusUpdateDto dto, string callerRole, int callerId)
    {
        var lesson = await db.Lessons
            .Include(l => l.Module)
                .ThenInclude(m => m.Course)
            .Include(l => l.StudentProgresses)
            .FirstOrDefaultAsync(l => l.LessonId == lessonId);

        if (lesson is null)
            return new ApiResponse<object>("Lesson not found.");

        if (IsTeacher(callerRole) && lesson.Module.Course.TeacherId != callerId)
            return new ApiResponse<object>(OwnershipDeniedMessage);

        var newStatus = dto.Status.ToLowerInvariant();

        if (newStatus == "published" && lesson.Status == "draft")
        {
            if (lesson.ContentType == "recorded" && string.IsNullOrWhiteSpace(lesson.ContentUrl))
                return new ApiResponse<object>("Cannot publish recorded lesson: content_url is empty.");
        }
        else if (newStatus == "draft" && lesson.Status == "published")
        {
            if (lesson.StudentProgresses.Count != 0)
                return new ApiResponse<object>("Cannot revert to draft: student progress exists.");
        }
        else if (newStatus != lesson.Status)
        {
            return new ApiResponse<object>($"Invalid status transition from '{lesson.Status}' to '{newStatus}'.");
        }

        lesson.Status = newStatus;
        await db.SaveChangesAsync();
        return new ApiResponse<object>(new { }, "Lesson status updated.");
    }

    // ── DELETE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> DeleteLessonAsync(int lessonId, string callerRole)
    {
        if (!"super_admin".Equals(callerRole, StringComparison.OrdinalIgnoreCase))
            return new ApiResponse<object>("Only super_admin can delete lessons.");

        var lesson = await db.Lessons
            .Include(l => l.StudentProgresses)
            .FirstOrDefaultAsync(l => l.LessonId == lessonId);

        if (lesson is null)
            return new ApiResponse<object>("Lesson not found.");

        if (lesson.StudentProgresses.Count != 0)
            return new ApiResponse<object>("Cannot delete lesson: student progress exists.");

        // Soft delete
        lesson.Status = "archived";
        await db.SaveChangesAsync();
        return new ApiResponse<object>(new { }, "Lesson deleted.");
    }

    // ── HELPERS ───────────────────────────────────────────────────────────────

    public async Task<bool> LessonExistsAsync(int lessonId) =>
        await db.Lessons.AnyAsync(l => l.LessonId == lessonId);
}

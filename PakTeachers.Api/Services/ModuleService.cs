using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;

namespace PakTeachers.Api.Services;

public class ModuleService(PakTeachersDbContext db) : IModuleService
{
    public const string OwnershipDeniedMessage = "Access denied: you do not own this course.";

    private static readonly HashSet<string> AdminRoles =
        new(StringComparer.OrdinalIgnoreCase) { "super_admin", "admin", "support" };

    private static bool IsAdmin(string? role) =>
        role is not null && AdminRoles.Contains(role);

    private static bool IsTeacher(string? role) =>
        "teacher".Equals(role, StringComparison.OrdinalIgnoreCase);

    // ── OWNERSHIP HELPERS ─────────────────────────────────────────────────────

    private async Task<bool> CallerOwnsCourseAsync(int courseId, int callerId) =>
        await db.Courses.AsNoTracking()
            .AnyAsync(c => c.CourseId == courseId && c.TeacherId == callerId);

    private async Task<bool> CallerOwnsModuleCourseAsync(int moduleId, int callerId) =>
        await db.Modules.AsNoTracking()
            .AnyAsync(m => m.ModuleId == moduleId && m.Course.TeacherId == callerId);

    // ── GET LIST ──────────────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<ModuleSummaryDto>>> GetModulesAsync(
        int courseId, string? callerRole, int callerId)
    {
        bool privileged = IsAdmin(callerRole) ||
            (IsTeacher(callerRole) && await CallerOwnsCourseAsync(courseId, callerId));

        var query = db.Modules.AsNoTracking()
            .Where(m => m.CourseId == courseId);

        if (!privileged)
            query = query.Where(m => m.Status == "active");

        var items = await query
            .OrderBy(m => m.ModuleId)
            .Select(m => new ModuleSummaryDto
            {
                ModuleId = m.ModuleId,
                CourseId = m.CourseId,
                Title = m.Title,
                LearningObjectives = m.LearningObjectives,
                StartDate = m.StartDate,
                EndDate = m.EndDate,
                Status = m.Status,
                LessonCount = m.Lessons.Count(l => privileged || l.Status == "published")
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<ModuleSummaryDto>>(items);
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    public async Task<ApiResponse<ModuleDetailDto>> GetModuleAsync(
        int moduleId, string? callerRole, int callerId)
    {
        var module = await db.Modules.AsNoTracking()
            .Include(m => m.Lessons)
            .FirstOrDefaultAsync(m => m.ModuleId == moduleId);

        if (module is null)
            return new ApiResponse<ModuleDetailDto>("Module not found.");

        bool privileged = IsAdmin(callerRole) ||
            (IsTeacher(callerRole) && module.Course.TeacherId == callerId);

        // Re-query with course for ownership check when not admin
        if (!IsAdmin(callerRole))
        {
            var moduleWithCourse = await db.Modules.AsNoTracking()
                .Include(m => m.Lessons)
                .Include(m => m.Course)
                .FirstOrDefaultAsync(m => m.ModuleId == moduleId);

            if (moduleWithCourse is null)
                return new ApiResponse<ModuleDetailDto>("Module not found.");

            privileged = IsAdmin(callerRole) ||
                (IsTeacher(callerRole) && moduleWithCourse.Course.TeacherId == callerId);

            if (moduleWithCourse.Status == "draft" && !privileged)
                return new ApiResponse<ModuleDetailDto>("Module not found.");

            module = moduleWithCourse;
        }
        else if (module.Status == "draft" && !privileged)
        {
            return new ApiResponse<ModuleDetailDto>("Module not found.");
        }

        var lessons = module.Lessons
            .Where(l => privileged || l.Status == "published")
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
            });

        return new ApiResponse<ModuleDetailDto>(new ModuleDetailDto
        {
            ModuleId = module.ModuleId,
            CourseId = module.CourseId,
            Title = module.Title,
            LearningObjectives = module.LearningObjectives,
            StartDate = module.StartDate,
            EndDate = module.EndDate,
            Status = module.Status,
            Notes = privileged ? module.Notes : null,
            LessonCount = lessons.Count(),
            Lessons = lessons
        });
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<ModuleSummaryDto>> CreateModuleAsync(
        int courseId, ModuleCreateDto dto, string callerRole, int callerId)
    {
        var course = await db.Courses.FindAsync(courseId);
        if (course is null)
            return new ApiResponse<ModuleSummaryDto>("Course not found.");

        if (IsTeacher(callerRole) && course.TeacherId != callerId)
            return new ApiResponse<ModuleSummaryDto>(OwnershipDeniedMessage);

        var module = new Module
        {
            CourseId = courseId,
            Title = dto.Title,
            LearningObjectives = dto.LearningObjectives,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Notes = dto.Notes,
            Status = "draft"
        };

        db.Modules.Add(module);
        await db.SaveChangesAsync();

        return new ApiResponse<ModuleSummaryDto>(new ModuleSummaryDto
        {
            ModuleId = module.ModuleId,
            CourseId = module.CourseId,
            Title = module.Title,
            LearningObjectives = module.LearningObjectives,
            StartDate = module.StartDate,
            EndDate = module.EndDate,
            Status = module.Status,
            LessonCount = 0
        });
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> UpdateModuleAsync(
        int moduleId, ModuleUpdateDto dto, string callerRole, int callerId)
    {
        var module = await db.Modules
            .Include(m => m.Course)
            .FirstOrDefaultAsync(m => m.ModuleId == moduleId);

        if (module is null)
            return new ApiResponse<object>("Module not found.");

        if (IsTeacher(callerRole) && module.Course.TeacherId != callerId)
            return new ApiResponse<object>(OwnershipDeniedMessage);

        if (dto.Title is not null) module.Title = dto.Title;
        if (dto.LearningObjectives is not null) module.LearningObjectives = dto.LearningObjectives;
        if (dto.StartDate.HasValue) module.StartDate = dto.StartDate;
        if (dto.EndDate.HasValue) module.EndDate = dto.EndDate;
        if (dto.Notes is not null) module.Notes = dto.Notes;

        await db.SaveChangesAsync();
        return new ApiResponse<object>(new { }, "Module updated successfully.");
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> UpdateModuleStatusAsync(
        int moduleId, ModuleStatusUpdateDto dto, string callerRole, int callerId)
    {
        var module = await db.Modules
            .Include(m => m.Course)
            .Include(m => m.Lessons)
                .ThenInclude(l => l.StudentProgresses)
            .FirstOrDefaultAsync(m => m.ModuleId == moduleId);

        if (module is null)
            return new ApiResponse<object>("Module not found.");

        if (IsTeacher(callerRole) && module.Course.TeacherId != callerId)
            return new ApiResponse<object>(OwnershipDeniedMessage);

        var newStatus = dto.Status.ToLowerInvariant();

        if (newStatus == "active" && module.Status == "draft")
        {
            bool hasPublishedLesson = module.Lessons.Any(l => l.Status == "published");
            if (!hasPublishedLesson)
                return new ApiResponse<object>("Cannot activate module: no published lessons.");
        }
        else if (newStatus == "draft" && module.Status == "active")
        {
            bool hasProgress = module.Lessons.Any(l => l.StudentProgresses.Count != 0);
            if (hasProgress)
                return new ApiResponse<object>("Cannot revert to draft: student progress exists.");
        }
        else if (newStatus != module.Status)
        {
            return new ApiResponse<object>($"Invalid status transition from '{module.Status}' to '{newStatus}'.");
        }

        module.Status = newStatus;
        await db.SaveChangesAsync();
        return new ApiResponse<object>(new { }, "Module status updated.");
    }

    // ── DELETE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> DeleteModuleAsync(int moduleId, string callerRole)
    {
        if (!IsAdmin(callerRole) || !"super_admin".Equals(callerRole, StringComparison.OrdinalIgnoreCase))
            return new ApiResponse<object>("Only super_admin can delete modules.");

        var module = await db.Modules
            .Include(m => m.Lessons)
                .ThenInclude(l => l.StudentProgresses)
            .FirstOrDefaultAsync(m => m.ModuleId == moduleId);

        if (module is null)
            return new ApiResponse<object>("Module not found.");

        bool hasProgress = module.Lessons.Any(l => l.StudentProgresses.Count != 0);
        if (hasProgress)
            return new ApiResponse<object>("Cannot delete module: student progress exists.");

        // Soft delete
        module.Status = "archived";
        foreach (var lesson in module.Lessons)
            lesson.Status = "archived";

        await db.SaveChangesAsync();
        return new ApiResponse<object>(new { }, "Module deleted.");
    }

    // ── HELPERS ───────────────────────────────────────────────────────────────

    public async Task<bool> ModuleExistsAsync(int moduleId) =>
        await db.Modules.AnyAsync(m => m.ModuleId == moduleId);

    public async Task<Module?> GetModuleRawAsync(int moduleId) =>
        await db.Modules.AsNoTracking()
            .Include(m => m.Course)
            .FirstOrDefaultAsync(m => m.ModuleId == moduleId);
}

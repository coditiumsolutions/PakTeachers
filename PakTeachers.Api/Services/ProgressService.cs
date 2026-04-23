using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;
using PakTeachers.Api.Wrappers;

namespace PakTeachers.Api.Services;

public class ProgressService(PakTeachersDbContext db) : IProgressService
{
    private static readonly HashSet<string> AdminRoles =
        new(StringComparer.OrdinalIgnoreCase) { "super_admin", "admin", "support" };

    private static bool IsAdmin(string? role) => role is not null && AdminRoles.Contains(role);
    private static bool IsTeacher(string? role) => "teacher".Equals(role, StringComparison.OrdinalIgnoreCase);
    private static bool IsStudent(string? role) => "student".Equals(role, StringComparison.OrdinalIgnoreCase);

    // ── GET ALL PROGRESS FOR A STUDENT ───────────────────────────────────────

    public async Task<ApiResponse<StudentProgressSummaryDto>> GetStudentProgressAsync(
        int studentId, string? callerRole, int callerId)
    {
        // Students can only access their own progress
        if (IsStudent(callerRole) && callerId != studentId)
            return new ApiResponse<StudentProgressSummaryDto>("Access denied.");

        // Teachers cannot access the flat student progress summary (no course scoping here)
        if (IsTeacher(callerRole))
            return new ApiResponse<StudentProgressSummaryDto>("Access denied.");

        var student = await db.Students.AsNoTracking()
            .FirstOrDefaultAsync(s => s.StudentId == studentId);
        if (student is null)
            return new ApiResponse<StudentProgressSummaryDto>("Student not found.");

        // Get all active enrollments for the student
        var enrollments = await db.Enrollments.AsNoTracking()
            .Where(e => e.StudentId == studentId && e.Status == "active")
            .Select(e => e.CourseId)
            .ToListAsync();

        // Load courses with their modules and lessons
        var courses = await db.Courses.AsNoTracking()
            .Where(c => enrollments.Contains(c.CourseId))
            .Include(c => c.Modules)
                .ThenInclude(m => m.Lessons)
            .OrderBy(c => c.Title)
            .ToListAsync();

        // Load all progress records for this student in one query
        var progressRecords = await db.StudentProgresses.AsNoTracking()
            .Where(p => p.StudentId == studentId)
            .ToListAsync();

        var progressLookup = progressRecords.ToDictionary(p => p.LessonId);

        var courseDtos = courses.Select(course =>
        {
            var moduleDtos = course.Modules.OrderBy(m => m.ModuleId).Select(module =>
            {
                var lessonDtos = module.Lessons.OrderBy(l => l.LessonId).Select(lesson =>
                {
                    progressLookup.TryGetValue(lesson.LessonId, out var prog);
                    return new ProgressLessonDto
                    {
                        ProgressId = prog?.ProgressId ?? 0,
                        LessonId = lesson.LessonId,
                        LessonTitle = lesson.Title,
                        Status = prog?.Status ?? "not_started",
                        CompletedAt = prog?.CompletedAt,
                        WatchTime = prog?.WatchTime
                    };
                }).ToList();

                return new ProgressModuleDto
                {
                    ModuleId = module.ModuleId,
                    ModuleTitle = module.Title,
                    Lessons = lessonDtos
                };
            }).ToList();

            int totalLessons = moduleDtos.Sum(m => m.Lessons.Count());
            int completedLessons = moduleDtos.Sum(m => m.Lessons.Count(l => l.Status == "completed"));
            double completionPct = totalLessons == 0 ? 0 :
                Math.Round((double)completedLessons / totalLessons * 100, 1);

            return new ProgressCourseDto
            {
                CourseId = course.CourseId,
                CourseTitle = course.Title,
                TotalLessons = totalLessons,
                CompletedLessons = completedLessons,
                CompletionPct = completionPct,
                Modules = moduleDtos
            };
        }).ToList();

        return new ApiResponse<StudentProgressSummaryDto>(new StudentProgressSummaryDto
        {
            StudentId = studentId,
            StudentName = student.FullName,
            Courses = courseDtos
        });
    }

    // ── GET PROGRESS FOR A STUDENT IN A SPECIFIC COURSE ──────────────────────

    public async Task<ApiResponse<CourseProgressDetailDto>> GetStudentCourseProgressAsync(
        int studentId, int courseId, string? callerRole, int callerId)
    {
        // Students can only access their own progress
        if (IsStudent(callerRole) && callerId != studentId)
            return new ApiResponse<CourseProgressDetailDto>("Access denied.");

        // Teachers can only access if they own the course
        if (IsTeacher(callerRole))
        {
            var course = await db.Courses.AsNoTracking()
                .FirstOrDefaultAsync(c => c.CourseId == courseId);
            if (course is null || course.TeacherId != callerId)
                return new ApiResponse<CourseProgressDetailDto>("Course not found.");
        }

        var student = await db.Students.AsNoTracking()
            .FirstOrDefaultAsync(s => s.StudentId == studentId);
        if (student is null)
            return new ApiResponse<CourseProgressDetailDto>("Student not found.");

        var courseEntity = await db.Courses.AsNoTracking()
            .Include(c => c.Modules)
                .ThenInclude(m => m.Lessons)
            .FirstOrDefaultAsync(c => c.CourseId == courseId);
        if (courseEntity is null)
            return new ApiResponse<CourseProgressDetailDto>("Course not found.");

        var progressRecords = await db.StudentProgresses.AsNoTracking()
            .Where(p => p.StudentId == studentId &&
                        p.Lesson.Module.CourseId == courseId)
            .ToListAsync();

        var progressLookup = progressRecords.ToDictionary(p => p.LessonId);

        var moduleDtos = courseEntity.Modules.OrderBy(m => m.ModuleId).Select(module =>
        {
            var lessonDtos = module.Lessons.OrderBy(l => l.LessonId).Select(lesson =>
            {
                progressLookup.TryGetValue(lesson.LessonId, out var prog);
                return new ProgressLessonDto
                {
                    ProgressId = prog?.ProgressId ?? 0,
                    LessonId = lesson.LessonId,
                    LessonTitle = lesson.Title,
                    Status = prog?.Status ?? "not_started",
                    CompletedAt = prog?.CompletedAt,
                    WatchTime = prog?.WatchTime
                };
            }).ToList();

            return new ProgressModuleDto
            {
                ModuleId = module.ModuleId,
                ModuleTitle = module.Title,
                Lessons = lessonDtos
            };
        }).ToList();

        int totalLessons = moduleDtos.Sum(m => m.Lessons.Count());
        int completedLessons = moduleDtos.Sum(m => m.Lessons.Count(l => l.Status == "completed"));
        double completionPct = totalLessons == 0 ? 0 :
            Math.Round((double)completedLessons / totalLessons * 100, 1);

        return new ApiResponse<CourseProgressDetailDto>(new CourseProgressDetailDto
        {
            StudentId = studentId,
            StudentName = student.FullName,
            CourseId = courseId,
            CourseTitle = courseEntity.Title,
            TotalLessons = totalLessons,
            CompletedLessons = completedLessons,
            CompletionPct = completionPct,
            Modules = moduleDtos
        });
    }

    // ── UPSERT PROGRESS (POST) ────────────────────────────────────────────────

    public async Task<ApiResponse<ProgressItemDto>> UpsertProgressAsync(
        ProgressCreateDto dto, string? callerRole, int callerId)
    {
        // Only the student themselves (or admin) can create progress
        if (IsStudent(callerRole) && callerId != dto.StudentId)
            return new ApiResponse<ProgressItemDto>("Access denied.");

        if (IsTeacher(callerRole))
            return new ApiResponse<ProgressItemDto>("Access denied.");

        // Load lesson with module → course
        var lesson = await db.Lessons.AsNoTracking()
            .Include(l => l.Module)
                .ThenInclude(m => m.Course)
            .FirstOrDefaultAsync(l => l.LessonId == dto.LessonId);
        if (lesson is null)
            return new ApiResponse<ProgressItemDto>("Lesson not found.");

        // Validate active enrollment
        bool enrolled = await db.Enrollments.AsNoTracking()
            .AnyAsync(e => e.StudentId == dto.StudentId &&
                           e.CourseId == lesson.Module.CourseId &&
                           e.Status == "active");
        if (!enrolled)
            return new ApiResponse<ProgressItemDto>("Student is not actively enrolled in this course.");

        // Upsert: return existing if already present
        var existing = await db.StudentProgresses
            .FirstOrDefaultAsync(p => p.StudentId == dto.StudentId && p.LessonId == dto.LessonId);

        if (existing is not null)
        {
            return new ApiResponse<ProgressItemDto>(MapToItemDto(existing, lesson), "Progress record already exists.");
        }

        var progress = new StudentProgress
        {
            StudentId = dto.StudentId,
            LessonId = dto.LessonId,
            Status = "in_progress"
        };

        db.StudentProgresses.Add(progress);
        await db.SaveChangesAsync();

        return new ApiResponse<ProgressItemDto>(MapToItemDto(progress, lesson), "Progress record created.");
    }

    // ── PATCH PROGRESS ────────────────────────────────────────────────────────

    public async Task<ApiResponse<ProgressItemDto>> PatchProgressAsync(
        int progressId, ProgressUpsertDto dto, string? callerRole, int callerId)
    {
        var progress = await db.StudentProgresses
            .Include(p => p.Lesson)
                .ThenInclude(l => l.Module)
                    .ThenInclude(m => m.Course)
            .FirstOrDefaultAsync(p => p.ProgressId == progressId);

        if (progress is null)
            return new ApiResponse<ProgressItemDto>("Progress record not found.");

        // Students can only update their own progress
        if (IsStudent(callerRole) && callerId != progress.StudentId)
            return new ApiResponse<ProgressItemDto>("Access denied.");

        if (IsTeacher(callerRole))
            return new ApiResponse<ProgressItemDto>("Access denied.");

        // State lock: cannot revert completed progress
        if (progress.Status == "completed" && dto.Status == "in_progress")
            return new ApiResponse<ProgressItemDto>(
                "Cannot revert a completed lesson back to in_progress.");

        if (dto.WatchTime.HasValue)
            progress.WatchTime = dto.WatchTime.Value;

        if (dto.Status is not null)
        {
            progress.Status = dto.Status;
            if (dto.Status == "completed" && progress.CompletedAt is null)
                progress.CompletedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync();

        return new ApiResponse<ProgressItemDto>(MapToItemDto(progress, progress.Lesson));
    }

    private static ProgressItemDto MapToItemDto(StudentProgress p, Lesson lesson) => new()
    {
        ProgressId = p.ProgressId,
        StudentId = p.StudentId,
        LessonId = p.LessonId,
        LessonTitle = lesson.Title,
        ModuleId = lesson.ModuleId,
        ModuleTitle = lesson.Module?.Title ?? "",
        CourseId = lesson.Module?.CourseId ?? 0,
        CourseTitle = lesson.Module?.Course?.Title ?? "",
        Status = p.Status,
        CompletedAt = p.CompletedAt,
        WatchTime = p.WatchTime
    };
}

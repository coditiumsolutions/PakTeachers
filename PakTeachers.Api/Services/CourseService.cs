using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;

namespace PakTeachers.Api.Services;

public class CourseService(PakTeachersDbContext db) : ICourseService
{
    private static readonly HashSet<string> ValidStatuses =
        new(StringComparer.OrdinalIgnoreCase) { "draft", "active", "completed", "archived" };

    // ── LIST ──────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<(IEnumerable<object> Items, int TotalCount)>> GetCoursesAsync(
        string? callerRole, int? callerTeacherId,
        string? type, string? gradeLevel, string? status, int? teacherId, string? search,
        bool includeDeleted, int page, int pageSize)
    {
        var isAdmin = IsAdmin(callerRole);
        var isTeacher = callerRole?.Equals("teacher", StringComparison.OrdinalIgnoreCase) == true;
        var isSuperAdmin = callerRole?.Equals("super_admin", StringComparison.OrdinalIgnoreCase) == true;

        var query = db.Courses
            .Include(c => c.Teacher)
            .Include(c => c.Modules)
            .Include(c => c.Enrollments)
            .AsQueryable();

        // Soft-delete filtering
        if (!isSuperAdmin || !includeDeleted)
            query = query.Where(c => c.Status != "archived");

        // Role-based visibility
        if (!isAdmin && !isTeacher)
            // Anonymous / student: active courses only
            query = query.Where(c => c.Status == "active");
        else if (isTeacher && callerTeacherId.HasValue)
            // Teacher: own courses only
            query = query.Where(c => c.TeacherId == callerTeacherId.Value);

        // Caller-applied filters
        if (!string.IsNullOrWhiteSpace(type))
            query = query.Where(c => c.CourseType == type.ToLower());
        if (!string.IsNullOrWhiteSpace(gradeLevel))
            query = query.Where(c => c.GradeLevel == gradeLevel);
        if (!string.IsNullOrWhiteSpace(status) && (isAdmin || isTeacher))
            query = query.Where(c => c.Status == status.ToLower());
        if (teacherId.HasValue && isAdmin)
            query = query.Where(c => c.TeacherId == teacherId.Value);
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(c => c.Title.Contains(search) ||
                (c.Description != null && c.Description.Contains(search)));

        var total = await query.CountAsync();

        var courses = await query
            .OrderBy(c => c.CourseId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        IEnumerable<object> items;
        if (isAdmin)
            items = courses.Select(c => (object)MapToAdminDto(c));
        else if (isTeacher)
            items = courses.Select(c => (object)MapToTeacherDto(c));
        else
            items = courses.Select(c => (object)MapToPublicDto(c));

        return new ApiResponse<(IEnumerable<object>, int)>((items, total));
    }

    // ── EXISTS / GET ──────────────────────────────────────────────────────────

    public async Task<bool> CourseExistsAsync(int courseId) =>
        await db.Courses.AnyAsync(c => c.CourseId == courseId);

    public async Task<Course?> GetCourseRawAsync(int courseId) =>
        await db.Courses
            .Include(c => c.Teacher)
            .Include(c => c.Modules)
            .Include(c => c.Enrollments)
            .FirstOrDefaultAsync(c => c.CourseId == courseId);

    // ── CREATE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<CourseAdminDto>> CreateCourseAsync(
        CourseCreateDto dto, string callerRole, int callerId)
    {
        int resolvedTeacherId;
        if (IsAdmin(callerRole))
        {
            if (!dto.TeacherId.HasValue)
                return new ApiResponse<CourseAdminDto>("teacherId is required when creating a course as an admin.");
            if (!await db.Teachers.AnyAsync(t => t.TeacherId == dto.TeacherId.Value))
                return new ApiResponse<CourseAdminDto>("Teacher not found.");
            resolvedTeacherId = dto.TeacherId.Value;
        }
        else
        {
            // Teacher: use JWT identity, ignore body teacherId
            resolvedTeacherId = callerId;
        }

        var course = new Course
        {
            TeacherId = resolvedTeacherId,
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim(),
            CourseType = dto.CourseType.ToLower(),
            GradeLevel = dto.GradeLevel?.Trim(),
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = "draft",
            Notes = dto.Notes?.Trim()
        };

        db.Courses.Add(course);
        await db.SaveChangesAsync();

        // Reload with Teacher nav
        await db.Entry(course).Reference(c => c.Teacher).LoadAsync();

        return new ApiResponse<CourseAdminDto>(MapToAdminDto(course), "Course created.");
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> UpdateCourseAsync(
        int courseId, CourseUpdateDto dto, string callerRole, int callerId)
    {
        var course = await GetCourseRawAsync(courseId);
        if (course is null)
            return new ApiResponse<object>("Course not found.");

        if (!IsAdmin(callerRole) && course.TeacherId != callerId)
            return new ApiResponse<object>(OwnershipDeniedMessage);

        var warnings = new List<string>();

        // Block course_type change if enrollments exist
        if (!string.IsNullOrWhiteSpace(dto.CourseType) &&
            !dto.CourseType.Equals(course.CourseType, StringComparison.OrdinalIgnoreCase))
        {
            if (course.Enrollments.Count > 0)
                return new ApiResponse<object>(
                    "Cannot change course_type when enrollments exist.");

            course.CourseType = dto.CourseType.ToLower();
        }

        // Warn if gradeLevel changes and active enrolled students have mismatched grade
        if (!string.IsNullOrWhiteSpace(dto.GradeLevel) &&
            !dto.GradeLevel.Equals(course.GradeLevel, StringComparison.OrdinalIgnoreCase))
        {
            var mismatchCount = await db.Enrollments
                .Where(e => e.CourseId == courseId && e.Status == "active")
                .Include(e => e.Student)
                .CountAsync(e => e.Student.GradeLevel != dto.GradeLevel);

            if (mismatchCount > 0)
                warnings.Add(
                    $"{mismatchCount} active enrollment(s) have students whose grade level does not match the new grade level '{dto.GradeLevel}'.");

            course.GradeLevel = dto.GradeLevel.Trim();
        }

        if (!string.IsNullOrWhiteSpace(dto.Title)) course.Title = dto.Title.Trim();
        if (dto.Description is not null) course.Description = dto.Description.Trim();
        if (dto.StartDate.HasValue) course.StartDate = dto.StartDate;
        if (dto.EndDate.HasValue) course.EndDate = dto.EndDate;
        if (dto.Notes is not null) course.Notes = dto.Notes.Trim();

        await db.SaveChangesAsync();

        var mapped = IsAdmin(callerRole) ? (object)MapToAdminDto(course) : MapToTeacherDto(course);
        var result = new ApiResponse<object>(mapped);
        if (warnings.Count > 0) result.Warnings = warnings;
        return result;
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> UpdateCourseStatusAsync(
        int courseId, CourseStatusUpdateDto dto, string callerRole, int callerId)
    {
        if (!ValidStatuses.Contains(dto.Status))
            return new ApiResponse<object>(
                $"Invalid status '{dto.Status}'. Valid values: draft, active, completed, archived.");

        var course = await GetCourseRawAsync(courseId);
        if (course is null)
            return new ApiResponse<object>("Course not found.");

        if (!IsAdmin(callerRole) && course.TeacherId != callerId)
            return new ApiResponse<object>(OwnershipDeniedMessage);

        var newStatus = dto.Status.ToLower();
        var currentStatus = course.Status;

        // Validate state machine transitions
        var (allowed, errorMsg) = (currentStatus, newStatus) switch
        {
            ("draft", "active") => (true, null),
            ("active", "completed") => (true, null),
            ("active", "draft") => (false, "Cannot move an active course back to draft when enrollments exist."),
            ("active", "archived") => (true, null),
            ("completed", "archived") => (true, null),
            _ => (false, $"Transition from '{currentStatus}' to '{newStatus}' is not allowed.")
        };

        if (!allowed)
        {
            // active -> draft: block only if enrollments exist
            if (currentStatus == "active" && newStatus == "draft")
            {
                var hasEnrollments = course.Enrollments.Count > 0;
                if (hasEnrollments)
                    return new ApiResponse<object>(errorMsg!);
                // allow if no enrollments
            }
            else
            {
                return new ApiResponse<object>(errorMsg!);
            }
        }

        // draft -> active: require at least 1 published lesson
        if (currentStatus == "draft" && newStatus == "active")
        {
            var publishedLessons = await db.Lessons
                .Where(l => l.Module.CourseId == courseId && l.Status == "published")
                .CountAsync();

            if (publishedLessons < 1)
                return new ApiResponse<object>(
                    "Cannot activate a course with no published lessons. Publish at least one lesson first.");
        }

        var warnings = new List<string>();

        // active -> completed: warn about active enrollments
        if (currentStatus == "active" && newStatus == "completed")
        {
            var activeEnrollments = await db.Enrollments
                .CountAsync(e => e.CourseId == courseId && e.Status == "active");

            if (activeEnrollments > 0)
                warnings.Add(
                    $"{activeEnrollments} active enrollment(s) will remain when the course is marked completed.");
        }

        // archived: block if active enrollments exist
        if (newStatus == "archived")
        {
            var activeEnrollments = await db.Enrollments
                .CountAsync(e => e.CourseId == courseId && e.Status == "active");

            if (activeEnrollments > 0)
                return new ApiResponse<object>(
                    $"Cannot archive a course with {activeEnrollments} active enrollment(s). Drop or transfer students first.");
        }

        course.Status = newStatus;
        await db.SaveChangesAsync();

        var message = dto.Reason is not null ? $"Status updated. Reason: {dto.Reason}" : "Status updated.";
        var mappedStatus = IsAdmin(callerRole) ? (object)MapToAdminDto(course) : MapToTeacherDto(course);
        var response = new ApiResponse<object>(mappedStatus, message);
        if (warnings.Count > 0) response.Warnings = warnings;
        return response;
    }

    // ── DELETE (soft) ─────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> DeleteCourseAsync(
        int courseId, string callerRole, int callerId)
    {
        var course = await GetCourseRawAsync(courseId);
        if (course is null)
            return new ApiResponse<object>("Course not found.");

        if (!IsAdmin(callerRole) && course.TeacherId != callerId)
            return new ApiResponse<object>(OwnershipDeniedMessage);

        var activeEnrollments = course.Enrollments.Count(e => e.Status == "active");
        if (activeEnrollments > 0)
            return new ApiResponse<object>(
                $"Cannot delete a course with {activeEnrollments} active enrollment(s). Drop or transfer students first.");

        course.Status = "archived";
        await db.SaveChangesAsync();

        return new ApiResponse<object>(true, "Course archived (soft-deleted).");
    }

    // ── MODULES ───────────────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<CourseModuleDto>>> GetModulesAsync(
        int courseId, string callerRole, int callerId)
    {
        var course = await db.Courses.FindAsync(courseId);
        if (course is null)
            return new ApiResponse<IEnumerable<CourseModuleDto>>("Course not found.");

        var isOwnerOrAdmin = IsAdmin(callerRole) ||
            (callerRole?.Equals("teacher", StringComparison.OrdinalIgnoreCase) == true && course.TeacherId == callerId);

        var query = db.Modules
            .Where(m => m.CourseId == courseId)
            .Include(m => m.Lessons)
            .AsQueryable();

        if (!isOwnerOrAdmin)
            query = query.Where(m => m.Status == "published");

        var modules = await query
            .OrderBy(m => m.ModuleId)
            .Select(m => new CourseModuleDto
            {
                ModuleId = m.ModuleId,
                CourseId = m.CourseId,
                Title = m.Title,
                LearningObjectives = m.LearningObjectives,
                StartDate = m.StartDate,
                EndDate = m.EndDate,
                Status = m.Status,
                Notes = isOwnerOrAdmin ? m.Notes : null,
                LessonCount = m.Lessons.Count
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<CourseModuleDto>>(modules);
    }

    // ── ENROLLMENTS ───────────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<object>>> GetEnrollmentsAsync(
        int courseId, string callerRole, int callerId)
    {
        var course = await db.Courses.FindAsync(courseId);
        if (course is null)
            return new ApiResponse<IEnumerable<object>>("Course not found.");

        var isAdmin = IsAdmin(callerRole);
        var isOwnerTeacher = callerRole?.Equals("teacher", StringComparison.OrdinalIgnoreCase) == true
            && course.TeacherId == callerId;

        if (!isAdmin && !isOwnerTeacher)
            return new ApiResponse<IEnumerable<object>>("Access denied.");

        var enrollments = await db.Enrollments
            .Where(e => e.CourseId == courseId)
            .Include(e => e.Student)
            .Include(e => e.Payments)
            .OrderBy(e => e.EnrollmentId)
            .ToListAsync();

        IEnumerable<object> dtos;

        if (isAdmin)
        {
            dtos = enrollments.Select(e => (object)new CourseEnrollmentDto
            {
                EnrollmentId = e.EnrollmentId,
                StudentId = e.StudentId,
                StudentName = e.Student.FullName,
                EnrolledDate = e.EnrolledDate,
                Status = e.Status,
                Payments = e.Payments.Select(p => new PaymentSummaryDto
                {
                    PaymentId = p.PaymentId,
                    Amount = p.Amount,
                    Currency = p.Currency,
                    Method = p.Method,
                    PaidAt = p.PaidAt,
                    Status = p.Status
                }).ToList()
            });
        }
        else
        {
            // Owner teacher: strip payments entirely
            dtos = enrollments.Select(e => (object)new CourseEnrollmentTeacherDto
            {
                EnrollmentId = e.EnrollmentId,
                StudentId = e.StudentId,
                StudentName = e.Student.FullName,
                EnrolledDate = e.EnrolledDate,
                Status = e.Status
            });
        }

        return new ApiResponse<IEnumerable<object>>(dtos);
    }

    // ── STUDENTS ROSTER ───────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<CourseStudentDto>>> GetStudentsAsync(
        int courseId, string callerRole, int callerId)
    {
        var course = await db.Courses.FindAsync(courseId);
        if (course is null)
            return new ApiResponse<IEnumerable<CourseStudentDto>>("Course not found.");

        if (!IsAdmin(callerRole) &&
            !(callerRole?.Equals("teacher", StringComparison.OrdinalIgnoreCase) == true && course.TeacherId == callerId))
            return new ApiResponse<IEnumerable<CourseStudentDto>>("Access denied.");

        var students = await db.Enrollments
            .Where(e => e.CourseId == courseId && e.Status == "active")
            .Include(e => e.Student)
            .OrderBy(e => e.Student.FullName)
            .Select(e => new CourseStudentDto
            {
                StudentId = e.StudentId,
                StudentName = e.Student.FullName,
                GradeLevel = e.Student.GradeLevel,
                EnrolledDate = e.EnrolledDate
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<CourseStudentDto>>(students);
    }

    // ── HELPERS ───────────────────────────────────────────────────────────────

    public const string OwnershipDeniedMessage = "You do not have permission to modify this course.";

    private static bool IsAdmin(string? role) =>
        role is not null && (
            role.Equals("super_admin", StringComparison.OrdinalIgnoreCase) ||
            role.Equals("admin", StringComparison.OrdinalIgnoreCase) ||
            role.Equals("support", StringComparison.OrdinalIgnoreCase));

    private static CoursePublicDto MapToPublicDto(Course c) => new()
    {
        CourseId = c.CourseId,
        TeacherId = c.TeacherId,
        TeacherName = c.Teacher?.FullName ?? "",
        Title = c.Title,
        Description = c.Description,
        CourseType = c.CourseType,
        GradeLevel = c.GradeLevel,
        StartDate = c.StartDate,
        EndDate = c.EndDate,
        Status = c.Status
    };

    private static CourseTeacherDto MapToTeacherDto(Course c) => new()
    {
        CourseId = c.CourseId,
        TeacherId = c.TeacherId,
        TeacherName = c.Teacher?.FullName ?? "",
        Title = c.Title,
        Description = c.Description,
        CourseType = c.CourseType,
        GradeLevel = c.GradeLevel,
        StartDate = c.StartDate,
        EndDate = c.EndDate,
        Status = c.Status,
        Notes = c.Notes,
        ModuleCount = c.Modules.Count,
        EnrollmentCount = c.Enrollments.Count
    };

    private static CourseAdminDto MapToAdminDto(Course c) => new()
    {
        CourseId = c.CourseId,
        TeacherId = c.TeacherId,
        TeacherName = c.Teacher?.FullName ?? "",
        Title = c.Title,
        Description = c.Description,
        CourseType = c.CourseType,
        GradeLevel = c.GradeLevel,
        StartDate = c.StartDate,
        EndDate = c.EndDate,
        Status = c.Status,
        Notes = c.Notes,
        ModuleCount = c.Modules.Count,
        EnrollmentCount = c.Enrollments.Count,
        ActiveEnrollmentCount = c.Enrollments.Count(e => e.Status == "active"),
        TotalEnrollmentCount = c.Enrollments.Count
    };
}

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

[ApiController]
[Route("api/courses")]
public class CoursesController(ICourseService courseService) : ControllerBase
{
    private int CallerId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

    private string? CallerRole =>
        User.FindFirstValue(ClaimTypes.Role);

    private bool IsAdmin =>
        CallerRole is not null && (
            CallerRole.Equals("super_admin", StringComparison.OrdinalIgnoreCase) ||
            CallerRole.Equals("admin", StringComparison.OrdinalIgnoreCase) ||
            CallerRole.Equals("support", StringComparison.OrdinalIgnoreCase));

    private bool IsTeacher =>
        CallerRole?.Equals("teacher", StringComparison.OrdinalIgnoreCase) == true;

    // ── LIST ──────────────────────────────────────────────────────────────────

    [HttpGet]
    public async Task<IActionResult> GetCourses(
        [FromQuery] string? type,
        [FromQuery] string? gradeLevel,
        [FromQuery] string? status,
        [FromQuery] int? teacherId,
        [FromQuery] string? search,
        [FromQuery] bool includeDeleted = false,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        int? callerTeacherId = IsTeacher ? CallerId : null;

        var result = await courseService.GetCoursesAsync(
            CallerRole, callerTeacherId,
            type, gradeLevel, status, teacherId, search,
            includeDeleted, page, pageSize);

        if (!result.Success) return BadRequest(result);

        var (items, total) = result.Data;
        return Ok(new
        {
            success = true,
            data = items,
            pagination = new { page, pageSize, totalCount = total, totalPages = (int)Math.Ceiling((double)total / pageSize) }
        });
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCourse(int id)
    {
        var course = await courseService.GetCourseRawAsync(id);
        if (course is null)
            return NotFound(new ApiResponse<object>("Course not found."));

        // Archived courses: return 200 with public-only fields and "unavailable" status hint
        if (course.Status == "archived")
        {
            return Ok(new ApiResponse<object>(new
            {
                courseId = course.CourseId,
                title = course.Title,
                status = "unavailable",
                message = "This course is no longer available."
            }));
        }

        // Admin: full detail with enrollment counts
        if (IsAdmin)
        {
            return Ok(new ApiResponse<object>(new CourseAdminDto
            {
                CourseId = course.CourseId,
                TeacherId = course.TeacherId,
                TeacherName = course.Teacher?.FullName ?? "",
                Title = course.Title,
                Description = course.Description,
                CourseType = course.CourseType,
                GradeLevel = course.GradeLevel,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                Status = course.Status,
                Notes = course.Notes,
                ModuleCount = course.Modules.Count,
                EnrollmentCount = course.Enrollments.Count,
                ActiveEnrollmentCount = course.Enrollments.Count(e => e.Status == "active"),
                TotalEnrollmentCount = course.Enrollments.Count
            }));
        }

        // Course owner (teacher): includes notes and counts, but not payment-level enrollment data
        if (IsTeacher && course.TeacherId == CallerId)
        {
            return Ok(new ApiResponse<object>(new CourseTeacherDto
            {
                CourseId = course.CourseId,
                TeacherId = course.TeacherId,
                TeacherName = course.Teacher?.FullName ?? "",
                Title = course.Title,
                Description = course.Description,
                CourseType = course.CourseType,
                GradeLevel = course.GradeLevel,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                Status = course.Status,
                Notes = course.Notes,
                ModuleCount = course.Modules.Count,
                EnrollmentCount = course.Enrollments.Count
            }));
        }

        // Everyone else: public fields only
        return Ok(new ApiResponse<object>(new CoursePublicDto
        {
            CourseId = course.CourseId,
            TeacherId = course.TeacherId,
            TeacherName = course.Teacher?.FullName ?? "",
            Title = course.Title,
            Description = course.Description,
            CourseType = course.CourseType,
            GradeLevel = course.GradeLevel,
            StartDate = course.StartDate,
            EndDate = course.EndDate,
            Status = course.Status
        }));
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    // Teachers always use their own JWT userId — body teacherId is ignored for them.
    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPost]
    public async Task<IActionResult> CreateCourse([FromBody] CourseCreateDto dto)
    {
        var result = await courseService.CreateCourseAsync(dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    // CourseOwnerOrAdmin policy pre-validates DB ownership before the action runs.
    // The service repeats the check as a defence-in-depth guard.
    [Authorize(Policy = "CourseOwnerOrAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCourse(int id, [FromBody] CourseUpdateDto dto)
    {
        if (!await courseService.CourseExistsAsync(id))
            return NotFound(new ApiResponse<object>("Course not found."));

        var result = await courseService.UpdateCourseAsync(id, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message == CourseService.OwnershipDeniedMessage)
                return StatusCode(403, result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    [Authorize(Policy = "CourseOwnerOrAdmin")]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] CourseStatusUpdateDto dto)
    {
        if (!await courseService.CourseExistsAsync(id))
            return NotFound(new ApiResponse<object>("Course not found."));

        var result = await courseService.UpdateCourseStatusAsync(id, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message == CourseService.OwnershipDeniedMessage)
                return StatusCode(403, result);

            if (result.Message?.Contains("not allowed") == true ||
                result.Message?.Contains("no published lessons") == true ||
                result.Message?.Contains("Invalid status") == true)
                return UnprocessableEntity(result);

            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── DELETE ────────────────────────────────────────────────────────────────

    [Authorize(Policy = "CourseOwnerOrAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        if (!await courseService.CourseExistsAsync(id))
            return NotFound(new ApiResponse<object>("Course not found."));

        var result = await courseService.DeleteCourseAsync(id, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message == CourseService.OwnershipDeniedMessage)
                return StatusCode(403, result);
            if (result.Message?.Contains("active enrollment") == true)
                return Conflict(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── MODULES ───────────────────────────────────────────────────────────────

    [HttpGet("{id}/modules")]
    public async Task<IActionResult> GetModules(int id)
    {
        if (!await courseService.CourseExistsAsync(id))
            return NotFound(new ApiResponse<object>("Course not found."));

        var result = await courseService.GetModulesAsync(id, CallerRole ?? "", CallerId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    // ── ENROLLMENTS ───────────────────────────────────────────────────────────

    [Authorize(Policy = "CourseOwnerOrAdmin")]
    [HttpGet("{id}/enrollments")]
    public async Task<IActionResult> GetEnrollments(int id)
    {
        if (!await courseService.CourseExistsAsync(id))
            return NotFound(new ApiResponse<object>("Course not found."));

        var result = await courseService.GetEnrollmentsAsync(id, CallerRole!, CallerId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    // ── STUDENTS ROSTER ───────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpGet("{id}/students")]
    public async Task<IActionResult> GetStudents(int id)
    {
        if (!await courseService.CourseExistsAsync(id))
            return NotFound(new ApiResponse<object>("Course not found."));

        var result = await courseService.GetStudentsAsync(id, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message == "Access denied.") return StatusCode(403, result);
            return BadRequest(result);
        }
        return Ok(result);
    }
}

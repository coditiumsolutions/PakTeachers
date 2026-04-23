using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

/// <summary>
/// Student account management — registration, profile, status, and sub-resource access
/// (enrollments, progress, submissions, payments, dashboard).
/// </summary>
[ApiController]
[Route("api/students")]
public class StudentsController(IStudentService studentService) : ControllerBase
{
    private bool CallerIsAdmin =>
        User.IsInRole("super_admin") || User.IsInRole("admin") || User.IsInRole("support");

    /// <summary>
    /// [POST] /api/students — Registers a new student account. Requires <c>super_admin</c> or <c>support</c>.
    /// </summary>
    /// <remarks>
    /// The <c>GradeLevel</c> field is automatically validated against the <c>grade_level</c>
    /// configuration key by the global <c>ConfigValidationFilter</c> before this action runs —
    /// any unrecognised value is rejected with <c>422</c>. The optional <c>City</c> field is
    /// similarly validated when provided.
    /// </remarks>
    /// <param name="dto">Student registration payload including name, email, grade level, and optional city.</param>
    /// <response code="200">Student created successfully.</response>
    /// <response code="400">Business rule violation (e.g. malformed payload).</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Caller lacks the required role.</response>
    /// <response code="409">A student with this email address already exists.</response>
    /// <response code="422">A <c>[ConfigValidation]</c> field contains an unrecognised value (fired by <c>ConfigValidationFilter</c>).</response>
    [Authorize(Roles = "super_admin,support")]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> CreateStudent([FromBody] StudentCreateDTO dto)
    {
        var createdBy = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await studentService.CreateStudentAsync(dto, createdBy);
        if (!result.Success)
            return result.Message?.Contains("email") == true ? Conflict(result) : BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// [GET] /api/students — Returns a filtered list of student accounts. Requires <c>super_admin</c> or <c>support</c>.
    /// </summary>
    /// <param name="grade">Filter by grade level value (e.g. <c>grade10</c>). Optional.</param>
    /// <param name="status">Filter by account status (e.g. <c>active</c>, <c>suspended</c>). Optional.</param>
    /// <param name="search">Full-name substring search. Optional.</param>
    /// <response code="200">Filtered student list returned.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Caller lacks the required role.</response>
    [Authorize(Roles = "super_admin,support")]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetStudents(
        [FromQuery] string? grade,
        [FromQuery] string? status,
        [FromQuery] string? search)
    {
        var result = await studentService.GetStudentsAsync(grade, status, search);
        return Ok(result);
    }

    /// <summary>
    /// [GET] /api/students/{id} — Returns a student profile. Admins receive the full admin view;
    /// students may only retrieve their own profile (self-restricted view).
    /// </summary>
    /// <param name="id">The student's unique identifier.</param>
    /// <response code="200">Profile returned (shape differs by caller role).</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Student attempting to access another student's profile.</response>
    /// <response code="404">No student found with this ID.</response>
    [Authorize(Policy = "StudentSelfOrAdmin")]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetStudent(int id)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        if (CallerIsAdmin)
        {
            var admin = await studentService.GetStudentAdminAsync(id);
            return Ok(new ApiResponse<StudentAdminResponseDTO>(admin!));
        }

        var self = await studentService.GetStudentSelfAsync(id);
        return Ok(new ApiResponse<StudentSelfResponseDTO>(self!));
    }

    /// <summary>
    /// [PUT] /api/students/{id} — Updates student profile fields. Students can only modify their
    /// own non-privileged fields; admins can modify all fields including grade level and city.
    /// </summary>
    /// <remarks>
    /// When provided, <c>GradeLevel</c> and <c>City</c> are validated against the configuration
    /// cache by the global <c>ConfigValidationFilter</c> before this action runs. Both fields use
    /// <c>AllowNull = true</c> so omitting them skips validation entirely.
    /// </remarks>
    /// <param name="id">The student's unique identifier.</param>
    /// <param name="dto">Fields to update. Only supplied fields are changed (partial update semantics).</param>
    /// <response code="200">Profile updated.</response>
    /// <response code="400">Business rule violation.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Student attempting to update another student's profile.</response>
    /// <response code="404">No student found with this ID.</response>
    /// <response code="409">Email already in use by another account.</response>
    /// <response code="422">A <c>[ConfigValidation]</c> field contains an unrecognised value.</response>
    [Authorize(Policy = "StudentSelfOrAdmin")]
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> UpdateStudent(int id, [FromBody] StudentUpdateDTO dto)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        var result = await studentService.UpdateStudentAsync(id, dto, CallerIsAdmin);
        if (!result.Success)
            return result.Message?.Contains("email") == true ? Conflict(result) : BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// [PATCH] /api/students/{id}/status — Changes a student's account status.
    /// Requires <c>super_admin</c> or <c>support</c>.
    /// </summary>
    /// <param name="id">The student's unique identifier.</param>
    /// <param name="dto">The target status value (e.g. <c>active</c>, <c>suspended</c>, <c>inactive</c>).</param>
    /// <response code="200">Status updated.</response>
    /// <response code="400">Invalid or disallowed status transition.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Caller lacks the required role.</response>
    /// <response code="404">No student found with this ID.</response>
    [Authorize(Roles = "super_admin,support")]
    [HttpPatch("{id}/status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] StudentStatusUpdateDTO dto)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        var result = await studentService.UpdateStudentStatusAsync(id, dto.Status);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    /// <summary>
    /// [GET] /api/students/{id}/enrollments — Returns all course enrollments for a student,
    /// optionally filtered by enrollment status.
    /// </summary>
    /// <param name="id">The student's unique identifier.</param>
    /// <param name="status">Filter by enrollment status (e.g. <c>active</c>, <c>pending</c>). Optional.</param>
    /// <response code="200">Enrollment list returned.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Student attempting to access another student's enrollments.</response>
    /// <response code="404">No student found with this ID.</response>
    [Authorize(Policy = "StudentSelfOrAdmin")]
    [HttpGet("{id}/enrollments")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetEnrollments(int id, [FromQuery] string? status)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        var result = await studentService.GetEnrollmentsAsync(id, status);
        return Ok(result);
    }

    /// <summary>
    /// [GET] /api/students/{id}/progress — Returns lesson-level watch-time and completion data
    /// for a student. Scope to a single enrollment with the <c>enrollmentId</c> query parameter.
    /// </summary>
    /// <param name="id">The student's unique identifier.</param>
    /// <param name="enrollmentId">Restrict results to a specific enrollment. Optional.</param>
    /// <response code="200">Progress records returned.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Student attempting to access another student's progress.</response>
    /// <response code="404">No student found with this ID.</response>
    [Authorize(Policy = "StudentSelfOrAdmin")]
    [HttpGet("{id}/progress")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProgress(int id, [FromQuery] int? enrollmentId)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        var result = await studentService.GetProgressAsync(id, enrollmentId);
        return Ok(result);
    }

    /// <summary>
    /// [GET] /api/students/{id}/submissions — Returns all assessment submissions made by the student,
    /// including scores and teacher feedback.
    /// </summary>
    /// <param name="id">The student's unique identifier.</param>
    /// <response code="200">Submission list returned.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Student attempting to access another student's submissions.</response>
    /// <response code="404">No student found with this ID.</response>
    [Authorize(Policy = "StudentSelfOrAdmin")]
    [HttpGet("{id}/submissions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetSubmissions(int id)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        var result = await studentService.GetSubmissionsAsync(id);
        return Ok(result);
    }

    /// <summary>
    /// [GET] /api/students/{id}/payments — Returns all payment records linked to the student,
    /// ordered by most recent first.
    /// </summary>
    /// <param name="id">The student's unique identifier.</param>
    /// <response code="200">Payment list returned.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Student attempting to access another student's payment history.</response>
    /// <response code="404">No student found with this ID.</response>
    [Authorize(Policy = "StudentSelfOrAdmin")]
    [HttpGet("{id}/payments")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPayments(int id)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        var result = await studentService.GetPaymentsAsync(id);
        return Ok(result);
    }

    /// <summary>
    /// [GET] /api/students/{id}/dashboard — Returns an aggregated student dashboard: active
    /// enrollments, recent lesson progress, upcoming assessments, and payment summary.
    /// </summary>
    /// <param name="id">The student's unique identifier.</param>
    /// <response code="200">Dashboard data returned.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Student attempting to access another student's dashboard.</response>
    /// <response code="404">No student found with this ID.</response>
    [Authorize(Policy = "StudentSelfOrAdmin")]
    [HttpGet("{id}/dashboard")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDashboard(int id)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        var result = await studentService.GetStudentDashboardAsync(id);
        return Ok(result);
    }
}

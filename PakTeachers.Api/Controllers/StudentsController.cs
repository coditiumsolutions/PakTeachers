using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

[ApiController]
[Route("api/students")]
public class StudentsController(IStudentService studentService) : ControllerBase
{
    private bool CallerIsAdmin =>
        User.IsInRole("super_admin") || User.IsInRole("admin") || User.IsInRole("support");

    // ── CREATE ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,support")]
    [HttpPost]
    public async Task<IActionResult> CreateStudent([FromBody] StudentCreateDTO dto)
    {
        var createdBy = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await studentService.CreateStudentAsync(dto, createdBy);
        if (!result.Success)
            return result.Message?.Contains("email") == true ? Conflict(result) : BadRequest(result);
        return Ok(result);
    }

    // ── LIST ──────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,support")]
    [HttpGet]
    public async Task<IActionResult> GetStudents(
        [FromQuery] string? grade,
        [FromQuery] string? status,
        [FromQuery] string? search)
    {
        var result = await studentService.GetStudentsAsync(grade, status, search);
        return Ok(result);
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    [Authorize(Policy = "StudentSelfOrAdmin")]
    [HttpGet("{id}")]
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

    // ── UPDATE ────────────────────────────────────────────────────────────────

    [Authorize(Policy = "StudentSelfOrAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, [FromBody] StudentUpdateDTO dto)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        var result = await studentService.UpdateStudentAsync(id, dto, CallerIsAdmin);
        if (!result.Success)
            return result.Message?.Contains("email") == true ? Conflict(result) : BadRequest(result);
        return Ok(result);
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,support")]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] StudentStatusUpdateDTO dto)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        var result = await studentService.UpdateStudentStatusAsync(id, dto.Status);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    // ── ENROLLMENTS ───────────────────────────────────────────────────────────

    [Authorize(Policy = "StudentSelfOrAdmin")]
    [HttpGet("{id}/enrollments")]
    public async Task<IActionResult> GetEnrollments(int id, [FromQuery] string? status)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        var result = await studentService.GetEnrollmentsAsync(id, status);
        return Ok(result);
    }

    // ── PROGRESS ──────────────────────────────────────────────────────────────

    [Authorize(Policy = "StudentSelfOrAdmin")]
    [HttpGet("{id}/progress")]
    public async Task<IActionResult> GetProgress(int id, [FromQuery] int? enrollmentId)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        var result = await studentService.GetProgressAsync(id, enrollmentId);
        return Ok(result);
    }

    // ── SUBMISSIONS ───────────────────────────────────────────────────────────

    [Authorize(Policy = "StudentSelfOrAdmin")]
    [HttpGet("{id}/submissions")]
    public async Task<IActionResult> GetSubmissions(int id)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        var result = await studentService.GetSubmissionsAsync(id);
        return Ok(result);
    }

    // ── PAYMENTS ──────────────────────────────────────────────────────────────

    [Authorize(Policy = "StudentSelfOrAdmin")]
    [HttpGet("{id}/payments")]
    public async Task<IActionResult> GetPayments(int id)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        var result = await studentService.GetPaymentsAsync(id);
        return Ok(result);
    }

    // ── DASHBOARD ─────────────────────────────────────────────────────────────

    [Authorize(Policy = "StudentSelfOrAdmin")]
    [HttpGet("{id}/dashboard")]
    public async Task<IActionResult> GetDashboard(int id)
    {
        if (!await studentService.StudentExistsAsync(id))
            return NotFound(new ApiResponse<object>("Student not found."));

        var result = await studentService.GetStudentDashboardAsync(id);
        return Ok(result);
    }
}

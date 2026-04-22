using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

[ApiController]
[Authorize]
public class EnrollmentsController(IEnrollmentService enrollmentService) : ControllerBase
{
    private int CallerId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

    private string? CallerRole =>
        User.FindFirstValue(ClaimTypes.Role);

    // ── LIST ──────────────────────────────────────────────────────────────────

    [HttpGet("api/enrollments")]
    public async Task<IActionResult> GetEnrollments(
        [FromQuery] string? status,
        [FromQuery] int? courseId,
        [FromQuery] int? studentId,
        [FromQuery] string? paymentStatus,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        var result = await enrollmentService.GetEnrollmentsAsync(
            status, courseId, studentId, paymentStatus, page, pageSize, CallerRole, CallerId);

        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    [HttpGet("api/enrollments/{id}")]
    public async Task<IActionResult> GetEnrollment(int id)
    {
        var result = await enrollmentService.GetEnrollmentAsync(id, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message == "Enrollment not found.") return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support")]
    [HttpPost("api/enrollments")]
    public async Task<IActionResult> CreateEnrollment([FromBody] EnrollmentCreateDto dto)
    {
        var result = await enrollmentService.CreateEnrollmentAsync(dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message?.Contains("already has an active enrollment") == true) return Conflict(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher,student")]
    [HttpPatch("api/enrollments/{id}/status")]
    public async Task<IActionResult> UpdateEnrollmentStatus(int id, [FromBody] EnrollmentStatusUpdateDto dto)
    {
        var result = await enrollmentService.UpdateEnrollmentStatusAsync(id, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message == "Enrollment not found.") return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }
}

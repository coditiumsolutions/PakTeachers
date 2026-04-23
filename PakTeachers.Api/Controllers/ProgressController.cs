using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

[ApiController]
[Authorize]
public class ProgressController(IProgressService progressService) : ControllerBase
{
    private int CallerId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

    private string? CallerRole =>
        User.FindFirstValue(ClaimTypes.Role);

    // ── GET /api/progress/{studentId} ─────────────────────────────────────────

    [HttpGet("api/progress/{studentId:int}")]
    public async Task<IActionResult> GetStudentProgress(int studentId)
    {
        var result = await progressService.GetStudentProgressAsync(studentId, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message == "Access denied.") return Forbid();
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── GET /api/progress/{studentId}/course/{courseId} ───────────────────────

    [HttpGet("api/progress/{studentId:int}/course/{courseId:int}")]
    public async Task<IActionResult> GetStudentCourseProgress(int studentId, int courseId)
    {
        var result = await progressService.GetStudentCourseProgressAsync(studentId, courseId, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message == "Access denied.") return Forbid();
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── POST /api/progress ────────────────────────────────────────────────────

    [HttpPost("api/progress")]
    public async Task<IActionResult> UpsertProgress([FromBody] ProgressCreateDto dto)
    {
        var result = await progressService.UpsertProgressAsync(dto, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message == "Access denied.") return Forbid();
            if (result.Message?.Contains("not actively enrolled") == true) return UnprocessableEntity(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── PATCH /api/progress/{progressId} ─────────────────────────────────────

    [HttpPatch("api/progress/{progressId:int}")]
    public async Task<IActionResult> PatchProgress(int progressId, [FromBody] ProgressUpsertDto dto)
    {
        var result = await progressService.PatchProgressAsync(progressId, dto, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message == "Access denied.") return Forbid();
            if (result.Message?.Contains("Cannot revert") == true) return UnprocessableEntity(result);
            return BadRequest(result);
        }
        return Ok(result);
    }
}

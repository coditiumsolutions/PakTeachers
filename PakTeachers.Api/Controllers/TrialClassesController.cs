using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

[ApiController]
[Authorize]
public class TrialClassesController(ITrialClassService trialClassService) : ControllerBase
{
    private int CallerId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

    private string? CallerRole =>
        User.FindFirstValue(ClaimTypes.Role);

    // ── LIST ──────────────────────────────────────────────────────────────────

    [HttpGet("api/trial-classes")]
    public async Task<IActionResult> GetTrialClasses(
        [FromQuery] string? status,
        [FromQuery] bool? converted,
        [FromQuery] int? teacherId)
    {
        var result = await trialClassService.GetTrialClassesAsync(
            status, converted, teacherId, CallerRole, CallerId);

        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    [HttpGet("api/trial-classes/{id}")]
    public async Task<IActionResult> GetTrialClass(int id)
    {
        var result = await trialClassService.GetTrialClassAsync(id, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message == "Trial class not found.") return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support")]
    [HttpPost("api/trial-classes")]
    public async Task<IActionResult> CreateTrialClass([FromBody] TrialClassCreateDto dto)
    {
        var result = await trialClassService.CreateTrialClassAsync(dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message?.Contains("already has a session") == true) return Conflict(result);
            if (result.Message?.Contains("Cannot book an academic subject") == true) return UnprocessableEntity(result);
            if (result.Message?.StartsWith("Database error:") == true) return StatusCode(500, result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPatch("api/trial-classes/{id}/status")]
    public async Task<IActionResult> UpdateTrialClassStatus(int id, [FromBody] TrialClassStatusUpdateDto dto)
    {
        var result = await trialClassService.UpdateTrialClassStatusAsync(id, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message == "Trial class not found.") return NotFound(result);
            if (result.Message?.Contains("already") == true) return UnprocessableEntity(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── CONVERT ───────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPatch("api/trial-classes/{id}/convert")]
    public async Task<IActionResult> ConvertTrialClass(int id, [FromBody] TrialClassConvertDto dto)
    {
        var result = await trialClassService.ConvertTrialClassAsync(id, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message?.Contains("already converted") == true) return Conflict(result);
            if (result.Message?.Contains("already has an active enrollment") == true) return Conflict(result);
            return BadRequest(result);
        }
        return Ok(result);
    }
}

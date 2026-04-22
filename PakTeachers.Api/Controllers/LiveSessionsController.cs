using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

[ApiController]
[Authorize]
public class LiveSessionsController(ILiveSessionService liveSessionService) : ControllerBase
{
    private int CallerId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

    private string? CallerRole =>
        User.FindFirstValue(ClaimTypes.Role);

    // ── UPCOMING (registered before /{id} to avoid routing conflict) ──────────

    [HttpGet("api/live-sessions/upcoming")]
    public async Task<IActionResult> GetUpcomingSessions()
    {
        var result = await liveSessionService.GetUpcomingSessionsAsync(CallerRole, CallerId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    [HttpGet("api/live-sessions/{id:int}")]
    public async Task<IActionResult> GetSession(int id)
    {
        var result = await liveSessionService.GetSessionAsync(id, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message == "Session not found.") return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── GET BY LESSON ─────────────────────────────────────────────────────────

    [HttpGet("api/lessons/{lessonId}/sessions")]
    public async Task<IActionResult> GetSessionsByLesson(int lessonId)
    {
        var result = await liveSessionService.GetSessionsByLessonAsync(lessonId, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPost("api/live-sessions")]
    public async Task<IActionResult> CreateSession([FromBody] LiveSessionCreateDto dto)
    {
        var result = await liveSessionService.CreateSessionAsync(dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message?.Contains("overlaps") == true) return Conflict(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPatch("api/live-sessions/{id}/status")]
    public async Task<IActionResult> UpdateSessionStatus(int id, [FromBody] LiveSessionStatusUpdateDto dto)
    {
        var result = await liveSessionService.UpdateSessionStatusAsync(id, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message == "Session not found.") return NotFound(result);
            if (result.Message?.Contains("Cannot cancel") == true ||
                result.Message?.Contains("not allowed") == true) return UnprocessableEntity(result);
            if (result.Message?.Contains("60 minutes") == true) return UnprocessableEntity(result);
            return BadRequest(result);
        }
        return Ok(result);
    }
}

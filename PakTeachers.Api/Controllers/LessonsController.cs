using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

[ApiController]
public class LessonsController(ILessonService lessonService) : ControllerBase
{
    private int CallerId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

    private string? CallerRole =>
        User.FindFirstValue(ClaimTypes.Role);

    // ── LIST (nested under module) ────────────────────────────────────────────

    [HttpGet("api/modules/{moduleId}/lessons")]
    public async Task<IActionResult> GetLessons(int moduleId)
    {
        var result = await lessonService.GetLessonsAsync(moduleId, CallerRole, CallerId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    [HttpGet("api/lessons/{id}")]
    public async Task<IActionResult> GetLesson(int id)
    {
        var result = await lessonService.GetLessonAsync(id, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message == "Lesson not found.") return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPost("api/modules/{moduleId}/lessons")]
    public async Task<IActionResult> CreateLesson(int moduleId, [FromBody] LessonCreateDto dto)
    {
        var result = await lessonService.CreateLessonAsync(moduleId, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message == LessonService.OwnershipDeniedMessage) return StatusCode(403, result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPut("api/lessons/{id}")]
    public async Task<IActionResult> UpdateLesson(int id, [FromBody] LessonUpdateDto dto)
    {
        if (!await lessonService.LessonExistsAsync(id))
            return NotFound(new ApiResponse<object>("Lesson not found."));

        var result = await lessonService.UpdateLessonAsync(id, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message == LessonService.OwnershipDeniedMessage) return StatusCode(403, result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPatch("api/lessons/{id}/status")]
    public async Task<IActionResult> UpdateLessonStatus(int id, [FromBody] LessonStatusUpdateDto dto)
    {
        if (!await lessonService.LessonExistsAsync(id))
            return NotFound(new ApiResponse<object>("Lesson not found."));

        var result = await lessonService.UpdateLessonStatusAsync(id, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message == LessonService.OwnershipDeniedMessage) return StatusCode(403, result);
            if (result.Message?.Contains("content_url is empty") == true ||
                result.Message?.Contains("Invalid status") == true)
                return UnprocessableEntity(result);
            if (result.Message?.Contains("student progress") == true) return BadRequest(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── DELETE ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin")]
    [HttpDelete("api/lessons/{id}")]
    public async Task<IActionResult> DeleteLesson(int id)
    {
        if (!await lessonService.LessonExistsAsync(id))
            return NotFound(new ApiResponse<object>("Lesson not found."));

        var result = await lessonService.DeleteLessonAsync(id, CallerRole!);
        if (!result.Success)
        {
            if (result.Message?.Contains("student progress") == true) return Conflict(result);
            return BadRequest(result);
        }
        return Ok(result);
    }
}

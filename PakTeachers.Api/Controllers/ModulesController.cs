using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

[ApiController]
public class ModulesController(IModuleService moduleService) : ControllerBase
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

    // ── LIST (nested under course) ────────────────────────────────────────────

    [HttpGet("api/courses/{courseId}/modules")]
    public async Task<IActionResult> GetModules(int courseId)
    {
        var result = await moduleService.GetModulesAsync(courseId, CallerRole, CallerId);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    [HttpGet("api/modules/{id}")]
    public async Task<IActionResult> GetModule(int id)
    {
        var result = await moduleService.GetModuleAsync(id, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message == "Module not found.") return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPost("api/courses/{courseId}/modules")]
    public async Task<IActionResult> CreateModule(int courseId, [FromBody] ModuleCreateDto dto)
    {
        var result = await moduleService.CreateModuleAsync(courseId, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message == ModuleService.OwnershipDeniedMessage) return StatusCode(403, result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPut("api/modules/{id}")]
    public async Task<IActionResult> UpdateModule(int id, [FromBody] ModuleUpdateDto dto)
    {
        if (!await moduleService.ModuleExistsAsync(id))
            return NotFound(new ApiResponse<object>("Module not found."));

        var result = await moduleService.UpdateModuleAsync(id, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message == ModuleService.OwnershipDeniedMessage) return StatusCode(403, result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPatch("api/modules/{id}/status")]
    public async Task<IActionResult> UpdateModuleStatus(int id, [FromBody] ModuleStatusUpdateDto dto)
    {
        if (!await moduleService.ModuleExistsAsync(id))
            return NotFound(new ApiResponse<object>("Module not found."));

        var result = await moduleService.UpdateModuleStatusAsync(id, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message == ModuleService.OwnershipDeniedMessage) return StatusCode(403, result);
            if (result.Message?.Contains("no published lessons") == true ||
                result.Message?.Contains("Invalid status") == true)
                return UnprocessableEntity(result);
            if (result.Message?.Contains("student progress") == true) return BadRequest(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── DELETE ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin")]
    [HttpDelete("api/modules/{id}")]
    public async Task<IActionResult> DeleteModule(int id)
    {
        if (!await moduleService.ModuleExistsAsync(id))
            return NotFound(new ApiResponse<object>("Module not found."));

        var result = await moduleService.DeleteModuleAsync(id, CallerRole!);
        if (!result.Success)
        {
            if (result.Message?.Contains("student progress") == true) return Conflict(result);
            return BadRequest(result);
        }
        return Ok(result);
    }
}

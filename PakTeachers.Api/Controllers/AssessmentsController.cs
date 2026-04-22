using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

[ApiController]
[Authorize]
public class AssessmentsController(IAssessmentService assessmentService) : ControllerBase
{
    private int CallerId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

    private string? CallerRole =>
        User.FindFirstValue(ClaimTypes.Role);

    // ── LIST ──────────────────────────────────────────────────────────────────

    [HttpGet("api/modules/{moduleId}/assessments")]
    public async Task<IActionResult> GetAssessments(int moduleId)
    {
        var result = await assessmentService.GetAssessmentsAsync(moduleId, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    [HttpGet("api/assessments/{id}")]
    public async Task<IActionResult> GetAssessment(int id)
    {
        var result = await assessmentService.GetAssessmentAsync(id, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message == "Assessment not found.") return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPost("api/modules/{moduleId}/assessments")]
    public async Task<IActionResult> CreateAssessment(int moduleId, [FromBody] AssessmentCreateDto dto)
    {
        var result = await assessmentService.CreateAssessmentAsync(moduleId, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message?.Contains("cannot exceed") == true) return UnprocessableEntity(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPut("api/assessments/{id}")]
    public async Task<IActionResult> UpdateAssessment(int id, [FromBody] AssessmentUpdateDto dto)
    {
        var result = await assessmentService.UpdateAssessmentAsync(id, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message == "Assessment not found.") return NotFound(result);
            if (result.Message?.Contains("Cannot change") == true) return UnprocessableEntity(result);
            if (result.Message?.Contains("cannot exceed") == true) return UnprocessableEntity(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPatch("api/assessments/{id}/status")]
    public async Task<IActionResult> UpdateAssessmentStatus(int id, [FromBody] AssessmentStatusUpdateDto dto)
    {
        var result = await assessmentService.UpdateAssessmentStatusAsync(id, dto, CallerRole!, CallerId);
        if (!result.Success)
        {
            if (result.Message == "Assessment not found.") return NotFound(result);
            if (result.Message?.Contains("Cannot revert") == true ||
                result.Message?.Contains("Only super_admin") == true) return UnprocessableEntity(result);
            return BadRequest(result);
        }
        return Ok(result);
    }
}

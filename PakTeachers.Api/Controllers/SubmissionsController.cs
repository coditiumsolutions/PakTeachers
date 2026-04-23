using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

[ApiController]
[Authorize]
public class SubmissionsController(ISubmissionService submissionService) : ControllerBase
{
    private int CallerId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

    private string? CallerRole =>
        User.FindFirstValue(ClaimTypes.Role);

    // ── GET /api/submissions (paginated, admin/teacher) ───────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpGet("api/submissions")]
    public async Task<IActionResult> GetSubmissions(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await submissionService.GetSubmissionsAsync(page, pageSize, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message == "Access denied.") return Forbid();
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── POST /api/submissions (student only) ──────────────────────────────────

    [Authorize(Roles = "student")]
    [HttpPost("api/submissions")]
    public async Task<IActionResult> CreateSubmission([FromBody] SubmissionCreateDto dto)
    {
        var result = await submissionService.CreateSubmissionAsync(dto, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message == "duplicate_submission") return Conflict(result);
            if (result.Message?.Contains("not active") == true ||
                result.Message?.Contains("not enrolled") == true) return UnprocessableEntity(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── PATCH /api/submissions/{id}/grade ─────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpPatch("api/submissions/{id:int}/grade")]
    public async Task<IActionResult> GradeSubmission(int id, [FromBody] SubmissionGradeDto dto)
    {
        var result = await submissionService.GradeSubmissionAsync(id, dto, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message?.Contains("Score must be") == true) return UnprocessableEntity(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── GET /api/assessments/{assessmentId}/submissions ───────────────────────

    [Authorize(Roles = "super_admin,admin,support,teacher")]
    [HttpGet("api/assessments/{assessmentId:int}/submissions")]
    public async Task<IActionResult> GetSubmissionsByAssessment(int assessmentId)
    {
        var result = await submissionService.GetSubmissionsByAssessmentAsync(assessmentId, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── GET /api/students/{studentId}/submissions ─────────────────────────────

    [HttpGet("api/students/{studentId:int}/submissions")]
    public async Task<IActionResult> GetSubmissionsByStudent(int studentId)
    {
        var result = await submissionService.GetSubmissionsByStudentAsync(studentId, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message == "Access denied.") return Forbid();
            return BadRequest(result);
        }
        return Ok(result);
    }
}

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

[ApiController]
[Route("api/teachers")]
public class TeachersController(ITeacherService teacherService) : ControllerBase
{
    [Authorize(Roles = "super_admin")]
    [HttpPost]
    public async Task<IActionResult> CreateTeacher([FromBody] TeacherCreateDTO dto)
    {
        var createdBy = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await teacherService.CreateTeacherAsync(dto, createdBy);
        if (!result.Success)
            return result.Message?.Contains("CNIC") == true ? Conflict(result) : BadRequest(result);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetTeachers([FromQuery] string? type, [FromQuery] string? status, [FromQuery] string? search)
    {
        bool isAdmin = User.Identity?.IsAuthenticated == true
            && (User.IsInRole("super_admin") || User.IsInRole("admin"));

        if (isAdmin)
        {
            var full = await teacherService.GetTeachersFullAsync(type, status, search);
            return Ok(full);
        }

        var pub = await teacherService.GetTeachersPublicAsync(type, status, search);
        return Ok(pub);
    }

    [Authorize(Policy = "TeacherSelfOrAdmin")]
    [HttpGet("{id}/courses")]
    public async Task<IActionResult> GetCourses(int id)
    {
        if (!await teacherService.TeacherExistsAsync(id))
            return NotFound(new ApiResponse<object>("Teacher not found."));

        var result = await teacherService.GetTeacherCoursesAsync(id);
        return Ok(result);
    }

    [Authorize(Policy = "TeacherSelfOrAdmin")]
    [HttpGet("{id}/live-sessions")]
    public async Task<IActionResult> GetLiveSessions(int id)
    {
        if (!await teacherService.TeacherExistsAsync(id))
            return NotFound(new ApiResponse<object>("Teacher not found."));

        var result = await teacherService.GetTeacherLiveSessionsAsync(id);
        return Ok(result);
    }

    [Authorize(Policy = "TeacherSelfOrAdmin")]
    [HttpGet("{id}/trial-classes")]
    public async Task<IActionResult> GetTrialClasses(int id)
    {
        if (!await teacherService.TeacherExistsAsync(id))
            return NotFound(new ApiResponse<object>("Teacher not found."));

        var result = await teacherService.GetTeacherTrialClassesAsync(id);
        return Ok(result);
    }

    [Authorize(Policy = "TeacherSelfOrAdmin")]
    [HttpGet("{id}/dashboard")]
    public async Task<IActionResult> GetDashboard(int id)
    {
        if (!await teacherService.TeacherExistsAsync(id))
            return NotFound(new ApiResponse<object>("Teacher not found."));

        bool isAdmin = User.IsInRole("super_admin") || User.IsInRole("admin");
        var result = await teacherService.GetTeacherDashboardAsync(id, isAdmin);
        return Ok(result);
    }
}

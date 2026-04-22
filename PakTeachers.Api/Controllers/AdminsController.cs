using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

[ApiController]
[Route("api/admins")]
[Authorize]
public class AdminsController(IAdminService adminService) : ControllerBase
{
    private int CallerId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private bool CallerIsSuperAdmin =>
        User.IsInRole("super_admin");

    // ── LIST ──────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin")]
    [HttpGet]
    public async Task<IActionResult> GetAdmins(
        [FromQuery] string? status,
        [FromQuery] string? role,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        var result = await adminService.GetAdminsAsync(status, role, search, page, pageSize);
        if (!result.Success) return BadRequest(result);

        var (items, total) = result.Data;
        return Ok(new
        {
            success = true,
            data = items,
            pagination = new { page, pageSize, totalCount = total, totalPages = (int)Math.Ceiling((double)total / pageSize) }
        });
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAdmin(int id)
    {
        // super_admin can view any; other admins can only view themselves
        if (!CallerIsSuperAdmin && CallerId != id)
            return StatusCode(403, new ApiResponse<object>("You can only view your own admin profile."));

        if (!await adminService.AdminExistsAsync(id))
            return NotFound(new ApiResponse<object>("Admin not found."));

        var dto = await adminService.GetAdminAsync(id);
        return Ok(new ApiResponse<AdminResponseDTO>(dto!));
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin")]
    [HttpPost]
    public async Task<IActionResult> CreateAdmin([FromBody] AdminCreateDTO dto)
    {
        var result = await adminService.CreateAdminAsync(dto);
        if (!result.Success)
        {
            if (result.Message?.Contains("email") == true || result.Message?.Contains("Username") == true)
                return Conflict(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAdmin(int id, [FromBody] AdminUpdateDTO dto)
    {
        // super_admin can update any; support can only update themselves
        if (!CallerIsSuperAdmin && CallerId != id)
            return StatusCode(403, new ApiResponse<object>("You can only update your own admin profile."));

        if (!await adminService.AdminExistsAsync(id))
            return NotFound(new ApiResponse<object>("Admin not found."));

        var result = await adminService.UpdateAdminAsync(id, dto);
        if (!result.Success)
            return result.Message?.Contains("email") == true ? Conflict(result) : BadRequest(result);
        return Ok(result);
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    [Authorize(Roles = "super_admin")]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] AdminStatusUpdateDTO dto)
    {
        if (!await adminService.AdminExistsAsync(id))
            return NotFound(new ApiResponse<object>("Admin not found."));

        var result = await adminService.UpdateAdminStatusAsync(id, dto.Status, dto.Reason, CallerId);
        if (!result.Success)
        {
            // Last super_admin constraint returns 409
            if (result.Message?.Contains("last active super_admin") == true)
                return Conflict(result);
            // Self-deactivation returns 403
            if (result.Message?.Contains("own account") == true)
                return StatusCode(403, result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── PASSWORD RESET — TEACHER ──────────────────────────────────────────────

    [Authorize(Roles = "super_admin,support")]
    [HttpPost("{id}/reset-password/teacher/{teacherId}")]
    public async Task<IActionResult> ResetTeacherPassword(int id, int teacherId)
    {
        // Route {id} must match the JWT caller
        if (CallerId != id)
            return StatusCode(403, new ApiResponse<object>("The admin ID in the route must match your own account."));

        var result = await adminService.ResetTeacherPasswordAsync(id, teacherId);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    // ── PASSWORD RESET — STUDENT ──────────────────────────────────────────────

    [Authorize(Roles = "super_admin,support")]
    [HttpPost("{id}/reset-password/student/{studentId}")]
    public async Task<IActionResult> ResetStudentPassword(int id, int studentId)
    {
        // Route {id} must match the JWT caller
        if (CallerId != id)
            return StatusCode(403, new ApiResponse<object>("The admin ID in the route must match your own account."));

        var result = await adminService.ResetStudentPasswordAsync(id, studentId);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }
}

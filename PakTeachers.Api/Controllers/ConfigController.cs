using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;
using PakTeachers.Api.Wrappers;

namespace PakTeachers.Api.Controllers;

[ApiController]
public class ConfigController(IConfigurationService configService) : ControllerBase
{
    // ── GET /api/config?key= (public) ─────────────────────────────────────────

    [AllowAnonymous]
    [HttpGet("api/config")]
    public IActionResult GetByKey([FromQuery] string? key)
    {
        if (string.IsNullOrWhiteSpace(key))
            return BadRequest(new ApiResponse<object>("Query parameter 'key' is required."));

        var values = configService.GetConfigsByKey(key);
        if (values is null)
            return NotFound(new ApiResponse<object>($"Configuration key '{key}' not found."));

        return Ok(new ApiResponse<IEnumerable<ConfigValueDto>>(values));
    }

    // ── GET /api/config/grouped (super_admin) ─────────────────────────────────

    [Authorize(Roles = "super_admin")]
    [HttpGet("api/config/grouped")]
    public async Task<IActionResult> GetGrouped()
    {
        var result = await configService.GetAllGroupedAsync();
        return Ok(new ApiResponse<IEnumerable<ConfigurationAdminDto>>(result));
    }

    // ── POST /api/config (super_admin) ────────────────────────────────────────

    [Authorize(Roles = "super_admin")]
    [HttpPost("api/config")]
    public async Task<IActionResult> Create([FromBody] ConfigCreateDto dto)
    {
        var result = await configService.CreateConfigAsync(dto);
        if (!result.Success)
        {
            if (result.Message?.Contains("already exists") == true) return Conflict(result);
            return UnprocessableEntity(result);
        }
        return Ok(result);
    }

    // ── PUT /api/config/{key} (super_admin) ───────────────────────────────────

    [Authorize(Roles = "super_admin")]
    [HttpPut("api/config/{key}")]
    public async Task<IActionResult> UpdateMeta(string key, [FromBody] ConfigUpdateMetaDto dto)
    {
        var result = await configService.UpdateMetaAsync(key, dto);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            return UnprocessableEntity(result);
        }
        return Ok(result);
    }

    // ── DELETE /api/config/{key} (super_admin) ────────────────────────────────

    [Authorize(Roles = "super_admin")]
    [HttpDelete("api/config/{key}")]
    public async Task<IActionResult> Delete(string key)
    {
        var result = await configService.DeleteConfigAsync(key);
        if (!result.Success)
        {
            if (result.Message?.Contains("protected") == true) return StatusCode(403, result);
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message?.Contains("record(s)") == true) return Conflict(result);
            return UnprocessableEntity(result);
        }
        return Ok(result);
    }

    // ── PATCH /api/config/{key}/append (super_admin) ──────────────────────────

    [Authorize(Roles = "super_admin")]
    [HttpPatch("api/config/{key}/append")]
    public async Task<IActionResult> Append(string key, [FromBody] ConfigValueAppendDto dto)
    {
        var result = await configService.AppendValueAsync(key, dto);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message?.Contains("already exists") == true) return Conflict(result);
            return UnprocessableEntity(result);
        }
        return Ok(result);
    }

    // ── PATCH /api/config/{key}/values/{value}/toggle (super_admin) ───────────

    [Authorize(Roles = "super_admin")]
    [HttpPatch("api/config/{key}/values/{value}/toggle")]
    public async Task<IActionResult> Toggle(string key, string value)
    {
        var result = await configService.ToggleValueAsync(key, value);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            return UnprocessableEntity(result);
        }
        return Ok(result);
    }

    // ── PATCH /api/config/{key}/remove (super_admin) ──────────────────────────

    [Authorize(Roles = "super_admin")]
    [HttpPatch("api/config/{key}/remove")]
    public async Task<IActionResult> Remove(string key, [FromBody] ConfigValueRemoveDto dto)
    {
        var result = await configService.RemoveValueAsync(key, dto.Value);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message?.Contains("record(s)") == true) return Conflict(result);
            return UnprocessableEntity(result);
        }
        return Ok(result);
    }
}

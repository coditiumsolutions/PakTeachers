using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;
using PakTeachers.Api.Wrappers;

namespace PakTeachers.Api.Controllers;

[ApiController]
public class ConfigurationsController(IConfigurationService configService) : ControllerBase
{
    // ── GET /api/configurations/{key} (public — frontend dropdowns) ───────────

    [AllowAnonymous]
    [HttpGet("api/configurations/{key}")]
    public IActionResult GetByKey(string key)
    {
        var values = configService.GetConfigsByKey(key);
        return Ok(new ApiResponse<IEnumerable<ConfigValueDto>>(values));
    }

    // ── POST /api/configurations/{id}/values (SuperAdmin only) ───────────────

    [Authorize(Roles = "super_admin")]
    [HttpPost("api/configurations/{id:int}/values")]
    public async Task<IActionResult> UpsertValue(int id, [FromBody] ConfigValueUpsertDto dto)
    {
        var result = await configService.UpsertConfigValueAsync(id, dto);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            return UnprocessableEntity(result);
        }
        return Ok(result);
    }
}

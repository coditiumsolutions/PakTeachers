using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;
using PakTeachers.Api.Wrappers;

namespace PakTeachers.Api.Controllers;

/// <summary>
/// Controlled-vocabulary configuration engine — manages the values that drive the global
/// <c>ConfigValidationFilter</c> and populate client-side dropdowns.
/// </summary>
[ApiController]
public class ConfigController(IConfigurationService configService) : ControllerBase
{
    /// <summary>
    /// [GET] /api/config — Fetches all active values for a specific configuration key.
    /// </summary>
    /// <remarks>
    /// Public endpoint — no authentication required. Returns only <c>isActive = true</c> entries.
    /// Typical use: populate a dropdown before form submission so the client sends a value that
    /// will pass the <c>ConfigValidationFilter</c>.
    /// </remarks>
    /// <param name="key">The configuration key to look up (e.g. <c>grade_level</c>, <c>course_type</c>).</param>
    /// <response code="200">Active values returned successfully.</response>
    /// <response code="400">The <c>key</c> query parameter was omitted.</response>
    /// <response code="404">No configuration exists for the given key.</response>
    [AllowAnonymous]
    [HttpGet("api/config")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetByKey([FromQuery] string? key)
    {
        if (string.IsNullOrWhiteSpace(key))
            return BadRequest(new ApiResponse<object>("Query parameter 'key' is required."));

        var values = configService.GetConfigsByKey(key);
        if (values is null)
            return NotFound(new ApiResponse<object>($"Configuration key '{key}' not found."));

        return Ok(new ApiResponse<IEnumerable<ConfigValueDto>>(values));
    }

    /// <summary>
    /// [GET] /api/config/grouped — Returns every configuration key with its complete value list
    /// (active and inactive). Requires <c>super_admin</c>.
    /// </summary>
    /// <remarks>
    /// Admin-only view used to inspect and manage the full vocabulary catalogue.
    /// Inactive values are visible here but are rejected by the <c>ConfigValidationFilter</c>.
    /// </remarks>
    /// <response code="200">All configuration groups returned.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Caller is not <c>super_admin</c>.</response>
    [Authorize(Roles = "super_admin")]
    [HttpGet("api/config/grouped")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetGrouped()
    {
        var result = await configService.GetAllGroupedAsync();
        return Ok(new ApiResponse<IEnumerable<ConfigurationAdminDto>>(result));
    }

    /// <summary>
    /// [POST] /api/config — Creates a new configuration key with an initial set of values.
    /// Requires <c>super_admin</c>.
    /// </summary>
    /// <remarks>
    /// Once created, the key is immediately available for use in <c>[ConfigValidation]</c> attributes
    /// on DTOs without a restart — the cache is refreshed automatically after every write.
    /// </remarks>
    /// <param name="dto">The new key name, optional label, and initial values array.</param>
    /// <response code="200">Configuration key created and cache refreshed.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Caller is not <c>super_admin</c>.</response>
    /// <response code="409">A configuration with this key already exists.</response>
    /// <response code="422">Validation error on the request body.</response>
    [Authorize(Roles = "super_admin")]
    [HttpPost("api/config")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
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

    /// <summary>
    /// [PUT] /api/config/{key} — Updates the display label or description metadata for a
    /// configuration key. Requires <c>super_admin</c>.
    /// </summary>
    /// <remarks>Does not affect the values list or active/inactive states.</remarks>
    /// <param name="key">The configuration key to update (e.g. <c>grade_level</c>).</param>
    /// <param name="dto">New label and/or description strings.</param>
    /// <response code="200">Metadata updated.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Caller is not <c>super_admin</c>.</response>
    /// <response code="404">No configuration exists for the given key.</response>
    [Authorize(Roles = "super_admin")]
    [HttpPut("api/config/{key}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

    /// <summary>
    /// [DELETE] /api/config/{key} — Permanently deletes a configuration key and all its values.
    /// Requires <c>super_admin</c>.
    /// </summary>
    /// <remarks>
    /// Blocked in two scenarios: (1) the key is on the protected list (e.g. <c>grade_level</c>,
    /// <c>payment_method</c>), or (2) existing database records still reference a value from this key.
    /// </remarks>
    /// <param name="key">The configuration key to delete.</param>
    /// <response code="200">Key deleted and cache refreshed.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Key is protected and cannot be deleted.</response>
    /// <response code="404">No configuration exists for the given key.</response>
    /// <response code="409">Existing records reference a value from this key.</response>
    [Authorize(Roles = "super_admin")]
    [HttpDelete("api/config/{key}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
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

    /// <summary>
    /// [PATCH] /api/config/{key}/append — Adds a new value to an existing configuration key's
    /// value list. Requires <c>super_admin</c>.
    /// </summary>
    /// <remarks>
    /// The new value is immediately active and will pass the <c>ConfigValidationFilter</c> on the
    /// next request — no restart required. Returns 409 if the value already exists on the key.
    /// </remarks>
    /// <param name="key">The configuration key to extend (e.g. <c>grade_level</c>).</param>
    /// <param name="dto">The new value string and optional display label.</param>
    /// <response code="200">Value appended and cache refreshed.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Caller is not <c>super_admin</c>.</response>
    /// <response code="404">No configuration exists for the given key.</response>
    /// <response code="409">The value already exists on this key.</response>
    [Authorize(Roles = "super_admin")]
    [HttpPatch("api/config/{key}/append")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
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

    /// <summary>
    /// [PATCH] /api/config/{key}/values/{value}/toggle — Flips a configuration value between
    /// active and inactive. Requires <c>super_admin</c>.
    /// </summary>
    /// <remarks>
    /// Deactivating a value causes any future DTO submission using that value to be rejected by
    /// the <c>ConfigValidationFilter</c> with a <c>422 Unprocessable Entity</c>. Existing records
    /// that already hold the value are unaffected. The cache is refreshed immediately.
    /// </remarks>
    /// <param name="key">The configuration key that owns the value.</param>
    /// <param name="value">The specific value to toggle (e.g. <c>grade10</c>).</param>
    /// <response code="200">Value toggled and cache refreshed.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Caller is not <c>super_admin</c>.</response>
    /// <response code="404">Key or value not found.</response>
    [Authorize(Roles = "super_admin")]
    [HttpPatch("api/config/{key}/values/{value}/toggle")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

    /// <summary>
    /// [PATCH] /api/config/{key}/remove — Permanently removes a specific value from a
    /// configuration key's value list. Requires <c>super_admin</c>.
    /// </summary>
    /// <remarks>
    /// Blocked if any existing database records currently hold the value being removed — use
    /// <c>/toggle</c> to deactivate without deleting when records exist. The cache is refreshed
    /// after a successful removal.
    /// </remarks>
    /// <param name="key">The configuration key that owns the value.</param>
    /// <param name="dto">The value string to remove.</param>
    /// <response code="200">Value removed and cache refreshed.</response>
    /// <response code="401">Missing or invalid JWT.</response>
    /// <response code="403">Caller is not <c>super_admin</c>.</response>
    /// <response code="404">Key or value not found.</response>
    /// <response code="409">Existing records reference this value — use toggle to deactivate instead.</response>
    [Authorize(Roles = "super_admin")]
    [HttpPatch("api/config/{key}/remove")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
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

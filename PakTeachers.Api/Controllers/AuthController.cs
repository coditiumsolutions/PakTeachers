using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService authService, IWebHostEnvironment env) : ControllerBase
{
    private static readonly CookieOptions TokenCookieOptions = new()
    {
        HttpOnly = true,
        SameSite = SameSiteMode.Strict,
        Path = "/",
        MaxAge = TimeSpan.FromDays(7),
    };

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        var result = await authService.LoginAsync(dto);
        if (!result.Success || result.Data is null)
            return Unauthorized(new ApiResponse<object>(result.Message ?? "Login failed."));

        var cookieOptions = new CookieOptions
        {
            HttpOnly = TokenCookieOptions.HttpOnly,
            SameSite = TokenCookieOptions.SameSite,
            Path = TokenCookieOptions.Path,
            MaxAge = TokenCookieOptions.MaxAge,
            // Secure only in non-development so local HTTP still works during dev
            Secure = !env.IsDevelopment(),
        };

        Response.Cookies.Append("token", result.Data.Token, cookieOptions);

        var publicResponse = new ApiResponse<LoginResponseDTO>(new LoginResponseDTO
        {
            Username = result.Data.Username,
            Role = result.Data.Role,
        }, "Login successful.");

        return Ok(publicResponse);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await authService.GetUserProfileAsync(userId, role);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        var result = await authService.ChangePasswordAsync(userId, role, dto.CurrentPassword, dto.NewPassword);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await authService.LogoutAsync(userId);

        // Expire the auth cookie immediately
        Response.Cookies.Append("token", "", new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Strict,
            Path = "/",
            Expires = DateTimeOffset.UnixEpoch,
            Secure = !env.IsDevelopment(),
        });

        return Ok(result);
    }
}

namespace PakTeachers.Api.DTOs;

// Returned in the login response body — token is issued as an HttpOnly cookie, never in the body.
public class LoginResponseDTO
{
    public string Username { get; set; } = null!;
    public string Role { get; set; } = null!;
}

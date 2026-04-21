namespace PakTeachers.Api.DTOs;

public class AuthResponseDTO
{
    public string Token { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Role { get; set; } = null!;
}

namespace PakTeachers.Api.DTOs;

public class UserProfileDTO
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Role { get; set; } = null!;
}

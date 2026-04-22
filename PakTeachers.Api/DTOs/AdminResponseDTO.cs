namespace PakTeachers.Api.DTOs;

public class AdminResponseDTO
{
    public int AdminId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}

public class AdminCreateResponseDTO
{
    public int AdminId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    // Only populated on creation. Shown once — store securely and distribute to the admin immediately.
    public string TemporaryPassword { get; set; } = null!;
}

public class PasswordResetResponseDTO
{
    public int TargetId { get; set; }
    public string TargetType { get; set; } = null!; // "teacher" or "student"
    public string Username { get; set; } = null!;

    // Only shown once — store securely and deliver to the user immediately.
    public string TemporaryPassword { get; set; } = null!;
}

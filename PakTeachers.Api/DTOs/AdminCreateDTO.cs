namespace PakTeachers.Api.DTOs;

public class AdminCreateDTO
{
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Username { get; set; }
    public string Role { get; set; } = null!;
}

public class AdminUpdateDTO
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    // Role and Status are silently ignored if provided; use dedicated endpoints.
}

public class AdminStatusUpdateDTO
{
    public string Status { get; set; } = null!;
    public string? Reason { get; set; }
}

namespace PakTeachers.Api.DTOs;

public class StudentCreateDTO
{
    public string FullName { get; set; } = null!;
    public string? Email { get; set; }
    public string GuardianName { get; set; } = null!;
    public string GuardianPhone { get; set; } = null!;
    public string GradeLevel { get; set; } = null!;
    public string Status { get; set; } = "active";
}

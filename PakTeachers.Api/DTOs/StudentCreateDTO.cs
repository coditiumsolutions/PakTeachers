using PakTeachers.Api.Attributes;

namespace PakTeachers.Api.DTOs;

public class StudentCreateDTO
{
    public string FullName { get; set; } = null!;
    public string? Email { get; set; }
    public string GuardianName { get; set; } = null!;
    public string GuardianPhone { get; set; } = null!;
    [ConfigValidation("grade_level")]
    public string GradeLevel { get; set; } = null!;
    [ConfigValidation("city", AllowNull = true)]
    public string? City { get; set; }
    public string Status { get; set; } = "active";
}

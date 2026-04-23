using PakTeachers.Api.Attributes;

namespace PakTeachers.Api.DTOs;

public class StudentUpdateDTO
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? GuardianName { get; set; }
    public string? GuardianPhone { get; set; }
    // Ignored when caller role is 'student'; only Admin/Support may change this.
    [ConfigValidation("grade_level", AllowNull = true)]
    public string? GradeLevel { get; set; }
    [ConfigValidation("city", AllowNull = true)]
    public string? City { get; set; }
}

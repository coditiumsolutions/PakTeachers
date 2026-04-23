namespace PakTeachers.Api.DTOs;

public class StudentUpdateDTO
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? GuardianName { get; set; }
    public string? GuardianPhone { get; set; }
    // Ignored when caller role is 'student'; only Admin/Support may change this.
    public string? GradeLevel { get; set; }
    public string? City { get; set; }
}

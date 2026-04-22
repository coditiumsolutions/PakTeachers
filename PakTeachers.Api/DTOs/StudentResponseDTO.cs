namespace PakTeachers.Api.DTOs;

public class StudentResponseDTO
{
    public int Id { get; set; }
    public string FullName { get; set; } = null!;
    public string? Email { get; set; }
    public string GuardianName { get; set; } = null!;
    public string GuardianPhone { get; set; } = null!;
    public string GradeLevel { get; set; } = null!;
    public string Username { get; set; } = null!;
    // Only populated on creation. Shown once — distribute to the student/guardian immediately.
    public string? PlainPassword { get; set; }
    public string Status { get; set; } = null!;
    public DateOnly EnrolledDate { get; set; }
    public int CreatedBy { get; set; }
}

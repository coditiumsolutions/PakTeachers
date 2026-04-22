namespace PakTeachers.Api.DTOs;

public class StudentAdminResponseDTO
{
    public int Id { get; set; }
    public string FullName { get; set; } = null!;
    public string? Email { get; set; }
    public string GuardianName { get; set; } = null!;
    public string GuardianPhone { get; set; } = null!;
    public string GradeLevel { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateOnly EnrolledDate { get; set; }
    public int CreatedBy { get; set; }
}

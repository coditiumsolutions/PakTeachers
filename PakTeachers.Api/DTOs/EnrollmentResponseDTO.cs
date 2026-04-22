namespace PakTeachers.Api.DTOs;

public class EnrollmentResponseDTO
{
    public int EnrollmentId { get; set; }
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = null!;
    public string? CourseGradeLevel { get; set; }
    public string CourseStatus { get; set; } = null!;
    public DateOnly EnrolledDate { get; set; }
    public string Status { get; set; } = null!;
}

namespace PakTeachers.Api.DTOs;

public class TeacherCourseSummaryDTO
{
    public int CourseId { get; set; }
    public string Title { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string? GradeLevel { get; set; }
    public int ModuleCount { get; set; }
    public int EnrolledStudentCount { get; set; }
}

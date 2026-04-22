namespace PakTeachers.Api.DTOs;

public class SubmissionResponseDTO
{
    public int SubmissionId { get; set; }
    public int AssessmentId { get; set; }
    public string AssessmentType { get; set; } = null!;
    public string ModuleTitle { get; set; } = null!;
    public string CourseTitle { get; set; } = null!;
    public int? Score { get; set; }
    public int TotalMarks { get; set; }
    public int Passmarks { get; set; }
    public bool? Passed { get; set; }
    public DateTime SubmittedAt { get; set; }
    public string? Feedback { get; set; }
}

using PakTeachers.Api.Attributes;

namespace PakTeachers.Api.DTOs;

public class AssessmentSummaryDto
{
    public int AssessmentId { get; set; }
    public int ModuleId { get; set; }
    public string AssessmentType { get; set; } = null!;
    public int TotalMarks { get; set; }
    public int Passmarks { get; set; }
    public double? Weightage { get; set; }
    public DateOnly? Date { get; set; }
    public string Status { get; set; } = null!;
}

public class AssessmentDetailDto : AssessmentSummaryDto
{
    public int CreatedBy { get; set; }
    public string CreatedByName { get; set; } = null!;
    public string ModuleTitle { get; set; } = null!;
    public MySubmissionDto? MySubmission { get; set; }
}

public class MySubmissionDto
{
    public int SubmissionId { get; set; }
    public int? Score { get; set; }
    public DateTime SubmittedAt { get; set; }
    public string? Feedback { get; set; }
}

public class AssessmentCreateDto
{
    [ConfigValidation("assessment_type")]
    public string AssessmentType { get; set; } = null!;
    public int TotalMarks { get; set; }
    public int Passmarks { get; set; }
    public double? Weightage { get; set; }
    public DateOnly? Date { get; set; }
}

public class AssessmentUpdateDto
{
    [ConfigValidation("assessment_type", AllowNull = true)]
    public string? AssessmentType { get; set; }
    public int? TotalMarks { get; set; }
    public int? Passmarks { get; set; }
    public double? Weightage { get; set; }
    public DateOnly? Date { get; set; }
}

public class AssessmentStatusUpdateDto
{
    [ConfigValidation("assessment_status")]
    public string Status { get; set; } = null!;
}

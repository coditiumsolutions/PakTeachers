namespace PakTeachers.Api.DTOs;

public class SubmissionSummaryDto
{
    public int SubmissionId { get; set; }
    public int AssessmentId { get; set; }
    public string AssessmentType { get; set; } = null!;
    public int StudentId { get; set; }
    public string StudentName { get; set; } = null!;
    public int? Score { get; set; }
    public int TotalMarks { get; set; }
    public int Passmarks { get; set; }
    public bool? Passed { get; set; }
    public DateTime SubmittedAt { get; set; }
    public string? Feedback { get; set; }
}

public class SubmissionDetailDto : SubmissionSummaryDto
{
    public string ModuleTitle { get; set; } = null!;
    public string CourseTitle { get; set; } = null!;
    public int? GradedBy { get; set; }
}

public class SubmissionCreateDto
{
    public int AssessmentId { get; set; }
}

public class SubmissionGradeDto
{
    public int Score { get; set; }
    public string? Feedback { get; set; }
}

public class PagedResult<T>
{
    public IEnumerable<T> Items { get; set; } = [];
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

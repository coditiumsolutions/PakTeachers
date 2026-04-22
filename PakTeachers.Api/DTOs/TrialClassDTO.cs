namespace PakTeachers.Api.DTOs;

// ── TRIAL CLASS RESPONSE DTOs ─────────────────────────────────────────────────

public class TrialClassSummaryDto
{
    public int TrialId { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = null!;
    public int TeacherId { get; set; }
    public string TeacherName { get; set; } = null!;
    public string Subject { get; set; } = null!;
    public DateTime ScheduledAt { get; set; }
    public string Status { get; set; } = null!;
    public bool Converted { get; set; }
}

public class TrialClassDetailDto : TrialClassSummaryDto
{
    public string? Feedback { get; set; }
    public string? GuardianName { get; set; }
    public string? GuardianPhone { get; set; }
}

// ── CREATE / UPDATE DTOs ──────────────────────────────────────────────────────

public class TrialClassCreateDto
{
    public int StudentId { get; set; }
    public int TeacherId { get; set; }
    public string Subject { get; set; } = null!;
    public DateTime ScheduledAt { get; set; }
}

public class TrialClassStatusUpdateDto
{
    public string Status { get; set; } = null!;
    public string? Feedback { get; set; }
}

public class TrialClassConvertDto
{
    public bool CreateEnrollment { get; set; }
    public int? CourseId { get; set; }
    public decimal? Amount { get; set; }
    public string? Currency { get; set; }
    public string? Method { get; set; }
}

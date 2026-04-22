namespace PakTeachers.Api.DTOs;

// ── LESSON RESPONSE DTOs ──────────────────────────────────────────────────────

public class LessonSummaryDto
{
    public int LessonId { get; set; }
    public int ModuleId { get; set; }
    public string Title { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public int? LearningTime { get; set; }
    public DateOnly? Date { get; set; }
    public string Status { get; set; } = null!;
}

public class LessonDetailDto : LessonSummaryDto
{
    public string? ContentUrl { get; set; }
    public bool RequiresEnrollment { get; set; }
    public string? Notes { get; set; }
}

// ── LESSON CREATE / UPDATE DTOs ───────────────────────────────────────────────

public class LessonCreateDto
{
    public string Title { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public string? ContentUrl { get; set; }
    public int? LearningTime { get; set; }
    public DateOnly? Date { get; set; }
    public string? Notes { get; set; }
}

public class LessonUpdateDto
{
    public string? Title { get; set; }
    public string? ContentUrl { get; set; }
    public int? LearningTime { get; set; }
    public DateOnly? Date { get; set; }
    public string? Notes { get; set; }
}

public class LessonStatusUpdateDto
{
    public string Status { get; set; } = null!;
}

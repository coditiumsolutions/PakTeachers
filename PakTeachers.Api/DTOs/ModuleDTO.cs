namespace PakTeachers.Api.DTOs;

// ── MODULE RESPONSE DTOs ──────────────────────────────────────────────────────

public class ModuleSummaryDto
{
    public int ModuleId { get; set; }
    public int CourseId { get; set; }
    public string Title { get; set; } = null!;
    public string? LearningObjectives { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string Status { get; set; } = null!;
    public int LessonCount { get; set; }
}

public class ModuleDetailDto : ModuleSummaryDto
{
    public string? Notes { get; set; }
    public IEnumerable<LessonSummaryDto> Lessons { get; set; } = [];
}

// ── MODULE CREATE / UPDATE DTOs ───────────────────────────────────────────────

public class ModuleCreateDto
{
    public string Title { get; set; } = null!;
    public string? LearningObjectives { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Notes { get; set; }
}

public class ModuleUpdateDto
{
    public string? Title { get; set; }
    public string? LearningObjectives { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Notes { get; set; }
}

public class ModuleStatusUpdateDto
{
    public string Status { get; set; } = null!;
}

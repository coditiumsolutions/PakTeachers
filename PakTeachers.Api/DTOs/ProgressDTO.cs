namespace PakTeachers.Api.DTOs;

public class ProgressLessonDto
{
    public int ProgressId { get; set; }
    public int LessonId { get; set; }
    public string LessonTitle { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime? CompletedAt { get; set; }
    public int? WatchTime { get; set; }
}

public class ProgressModuleDto
{
    public int ModuleId { get; set; }
    public string ModuleTitle { get; set; } = null!;
    public IEnumerable<ProgressLessonDto> Lessons { get; set; } = [];
}

public class ProgressCourseDto
{
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = null!;
    public int TotalLessons { get; set; }
    public int CompletedLessons { get; set; }
    public double CompletionPct { get; set; }
    public IEnumerable<ProgressModuleDto> Modules { get; set; } = [];
}

public class StudentProgressSummaryDto
{
    public int StudentId { get; set; }
    public string StudentName { get; set; } = null!;
    public IEnumerable<ProgressCourseDto> Courses { get; set; } = [];
}

public class CourseProgressDetailDto
{
    public int StudentId { get; set; }
    public string StudentName { get; set; } = null!;
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = null!;
    public int TotalLessons { get; set; }
    public int CompletedLessons { get; set; }
    public double CompletionPct { get; set; }
    public IEnumerable<ProgressModuleDto> Modules { get; set; } = [];
}

public class ProgressCreateDto
{
    public int StudentId { get; set; }
    public int LessonId { get; set; }
}

public class ProgressUpsertDto
{
    public int? WatchTime { get; set; }
    public string? Status { get; set; }
}

public class ProgressItemDto
{
    public int ProgressId { get; set; }
    public int StudentId { get; set; }
    public int LessonId { get; set; }
    public string LessonTitle { get; set; } = null!;
    public int ModuleId { get; set; }
    public string ModuleTitle { get; set; } = null!;
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime? CompletedAt { get; set; }
    public int? WatchTime { get; set; }
}

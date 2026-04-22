namespace PakTeachers.Api.DTOs;

public class CourseLessonProgressDTO
{
    public int LessonId { get; set; }
    public string LessonTitle { get; set; } = null!;
    public string ProgressStatus { get; set; } = null!;
    public DateTime? CompletedAt { get; set; }
    public int? WatchTime { get; set; }
}

public class CourseProgressDTO
{
    public int EnrollmentId { get; set; }
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = null!;
    public int TotalLessons { get; set; }
    public int CompletedLessons { get; set; }
    public int CompletionPct { get; set; }
    public IEnumerable<CourseLessonProgressDTO> Lessons { get; set; } = [];
}

public class ProgressResponseDTO
{
    public int OverallCompletion { get; set; }
    public IEnumerable<CourseProgressDTO> Courses { get; set; } = [];
}

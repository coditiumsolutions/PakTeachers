namespace PakTeachers.Api.DTOs;

public class LiveSessionSummaryDto
{
    public int SessionId { get; set; }
    public int LessonId { get; set; }
    public string LessonTitle { get; set; } = null!;
    public int TeacherId { get; set; }
    public string TeacherName { get; set; } = null!;
    public DateTime ScheduledAt { get; set; }
    public int? DurationMinutes { get; set; }
    public string Status { get; set; } = null!;
}

public class LiveSessionDetailDto : LiveSessionSummaryDto
{
    public string? MeetingLink { get; set; }
    public string? RecordingUrl { get; set; }
    public string CourseTitle { get; set; } = null!;
}

public class LiveSessionCreateDto
{
    public int LessonId { get; set; }
    public int TeacherId { get; set; }
    public DateTime ScheduledAt { get; set; }
    public int? DurationMinutes { get; set; }
    public string? MeetingLink { get; set; }
}

public class LiveSessionStatusUpdateDto
{
    public string Status { get; set; } = null!;
}

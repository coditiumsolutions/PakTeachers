namespace PakTeachers.Api.DTOs;

public class LiveSessionTeacherViewDTO
{
    public int SessionId { get; set; }
    public DateTime ScheduledAt { get; set; }
    public string LessonTitle { get; set; } = null!;
    public string CourseTitle { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string? MeetingLink { get; set; }
}

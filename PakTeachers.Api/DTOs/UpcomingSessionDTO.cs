namespace PakTeachers.Api.DTOs;

public class UpcomingSessionDTO
{
    public int SessionId { get; set; }
    public DateTime ScheduledAt { get; set; }
    public string LessonTitle { get; set; } = null!;
    public string CourseTitle { get; set; } = null!;
}

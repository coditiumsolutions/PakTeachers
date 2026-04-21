namespace PakTeachers.Api.DTOs;

public class TrialClassTeacherViewDTO
{
    public int TrialId { get; set; }
    public string StudentName { get; set; } = null!;
    public string Subject { get; set; } = null!;
    public DateTime ScheduledAt { get; set; }
    public string Status { get; set; } = null!;
    public string? Feedback { get; set; }
    public bool Converted { get; set; }
}

namespace PakTeachers.Api.DTOs;

public class TeacherDashboardDTO
{
    public int ActiveCoursesCount { get; set; }
    public int TotalStudentsCount { get; set; }
    public int PendingTrialsCount { get; set; }
    public int PendingSubmissionsCount { get; set; }
    public int CompletedSessionsThisMonth { get; set; }
    public IEnumerable<UpcomingSessionDTO> UpcomingSessions { get; set; } = [];
    // Populated only when the caller is an Admin. Null when Teacher is the caller,
    // or when no LastLogin is tracked in the schema yet.
    public DateTime? LastLogin { get; set; }
}

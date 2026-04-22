namespace PakTeachers.Api.DTOs;

public class DashboardUpcomingSessionDTO
{
    public int SessionId { get; set; }
    public DateTime ScheduledAt { get; set; }
    public string LessonTitle { get; set; } = null!;
    public string CourseTitle { get; set; } = null!;
    // Only populated when session is within 30 minutes of UtcNow.
    public string? MeetingLink { get; set; }
}

public class RecentGradeDTO
{
    public int SubmissionId { get; set; }
    public string AssessmentType { get; set; } = null!;
    public string CourseTitle { get; set; } = null!;
    public int Score { get; set; }
    public int TotalMarks { get; set; }
    public bool Passed { get; set; }
}

public class PendingPaymentDTO
{
    public int PaymentId { get; set; }
    public string CourseTitle { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = null!;
}

public class StudentDashboardDTO
{
    public int ActiveEnrollments { get; set; }
    public int OverallCompletionPct { get; set; }
    public int PendingSubmissions { get; set; }
    public IEnumerable<DashboardUpcomingSessionDTO> UpcomingSessions { get; set; } = [];
    public IEnumerable<RecentGradeDTO> RecentGrades { get; set; } = [];
    public IEnumerable<PendingPaymentDTO> PendingPayments { get; set; } = [];
}

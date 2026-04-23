using PakTeachers.Api.Attributes;

namespace PakTeachers.Api.DTOs;

public class PaymentStudentInfoDto
{
    public int StudentId { get; set; }
    public string StudentName { get; set; } = "";
    public string GuardianPhone { get; set; } = "";
}

public class PaymentEnrollmentInfoDto
{
    public int EnrollmentId { get; set; }
    public string CourseTitle { get; set; } = "";
    public string Status { get; set; } = "";
}

public class PaymentListItemDto
{
    public int PaymentId { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = "";
    public int EnrollmentId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "";
    public string Method { get; set; } = "";
    public DateTime PaidAt { get; set; }
    public string Status { get; set; } = "";
}

public class PaymentDetailDto : PaymentListItemDto
{
    public PaymentStudentInfoDto Student { get; set; } = new();
    public PaymentEnrollmentInfoDto Enrollment { get; set; } = new();
}

public class PaymentStudentViewDto
{
    public int PaymentId { get; set; }
    public int EnrollmentId { get; set; }
    public string CourseTitle { get; set; } = "";
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "";
    public string Method { get; set; } = "";
    public DateTime PaidAt { get; set; }
    public string Status { get; set; } = "";
}

public class PaymentCreateDto
{
    public int StudentId { get; set; }
    public int EnrollmentId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "PKR";
    [ConfigValidation("payment_method")]
    public string Method { get; set; } = "";
    public string? Notes { get; set; }
}

public class PaymentStatusPatchDto
{
    [ConfigValidation("payment_status")]
    public string Status { get; set; } = "";
    public string? Notes { get; set; }
}

// ── Analytics ────────────────────────────────────────────────────────────────

public class MonthlyPaymentDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public int TotalPayments { get; set; }
    public decimal TotalRevenue { get; set; }
    public Dictionary<string, int> ByMethod { get; set; } = new();
    public Dictionary<string, int> ByStatus { get; set; } = new();
}

public class AllTimeSummaryDto
{
    public int TotalPayments { get; set; }
    public decimal TotalRevenue { get; set; }
    public Dictionary<string, int> ByMethod { get; set; } = new();
    public Dictionary<string, int> ByStatus { get; set; } = new();
}

public class PaymentAnalyticsDto
{
    public AllTimeSummaryDto AllTime { get; set; } = new();
    public List<MonthlyPaymentDto> Monthly { get; set; } = new();
}

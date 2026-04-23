using PakTeachers.Api.Attributes;

namespace PakTeachers.Api.DTOs;

// ── ENROLLMENT RESPONSE DTOs ──────────────────────────────────────────────────

public class EnrollmentSummaryDto
{
    public int EnrollmentId { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = null!;
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = null!;
    public DateOnly EnrolledDate { get; set; }
    public string Status { get; set; } = null!;
    public string PaymentStatus { get; set; } = null!;
}

public class EnrollmentDetailDto : EnrollmentSummaryDto
{
    public IEnumerable<PaymentSummaryDto>? Payments { get; set; }
}

// ── CREATE / UPDATE DTOs ──────────────────────────────────────────────────────

public class EnrollmentCreateDto
{
    public int StudentId { get; set; }
    public int CourseId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "PKR";
    [ConfigValidation("payment_method")]
    public string Method { get; set; } = null!;
}

public class EnrollmentStatusUpdateDto
{
    [ConfigValidation("enrollment_status")]
    public string Status { get; set; } = null!;
}

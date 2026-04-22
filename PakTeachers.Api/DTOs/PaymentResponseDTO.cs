namespace PakTeachers.Api.DTOs;

public class PaymentResponseDTO
{
    public int PaymentId { get; set; }
    public int EnrollmentId { get; set; }
    public string CourseTitle { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = null!;
    public string Method { get; set; } = null!;
    public DateTime PaidAt { get; set; }
    public string Status { get; set; } = null!;
}

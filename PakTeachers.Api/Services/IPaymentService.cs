using PakTeachers.Api.DTOs;
using PakTeachers.Api.Wrappers;

namespace PakTeachers.Api.Services;

public interface IPaymentService
{
    Task<ApiResponse<PagedResult<PaymentListItemDto>>> GetPaymentsAsync(
        int page, int pageSize,
        string? status, string? method, int? studentId, int? enrollmentId,
        DateTime? from, DateTime? to);

    Task<ApiResponse<PaymentDetailDto>> GetPaymentByIdAsync(int paymentId);

    Task<ApiResponse<IEnumerable<PaymentStudentViewDto>>> GetPaymentsByStudentAsync(
        int studentId, string? status, string? callerRole, int callerId);

    Task<ApiResponse<PaymentDetailDto>> CreatePaymentAsync(PaymentCreateDto dto);

    Task<ApiResponse<PaymentListItemDto>> PatchPaymentStatusAsync(
        int paymentId, PaymentStatusPatchDto dto, string? callerRole);

    Task<ApiResponse<PaymentAnalyticsDto>> GetPaymentSummaryAsync();
}

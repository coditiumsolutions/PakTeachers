using PakTeachers.Api.DTOs;

namespace PakTeachers.Api.Services;

public interface IEnrollmentService
{
    Task<ApiResponse<IEnumerable<EnrollmentSummaryDto>>> GetEnrollmentsAsync(
        string? statusFilter, int? courseId, int? studentId, string? paymentStatus,
        int page, int pageSize, string? callerRole, int callerId);

    Task<ApiResponse<EnrollmentDetailDto>> GetEnrollmentAsync(
        int enrollmentId, string? callerRole, int callerId);

    Task<ApiResponse<EnrollmentDetailDto>> CreateEnrollmentAsync(
        EnrollmentCreateDto dto, string callerRole, int callerId);

    Task<ApiResponse<object>> UpdateEnrollmentStatusAsync(
        int enrollmentId, EnrollmentStatusUpdateDto dto, string callerRole, int callerId);
}

using PakTeachers.Api.DTOs;

namespace PakTeachers.Api.Services;

public interface IAssessmentService
{
    Task<ApiResponse<IEnumerable<AssessmentSummaryDto>>> GetAssessmentsAsync(
        int moduleId, string? callerRole, int callerId);

    Task<ApiResponse<AssessmentDetailDto>> GetAssessmentAsync(
        int assessmentId, string? callerRole, int callerId);

    Task<ApiResponse<AssessmentDetailDto>> CreateAssessmentAsync(
        int moduleId, AssessmentCreateDto dto, string callerRole, int callerId);

    Task<ApiResponse<AssessmentDetailDto>> UpdateAssessmentAsync(
        int assessmentId, AssessmentUpdateDto dto, string callerRole, int callerId);

    Task<ApiResponse<object>> UpdateAssessmentStatusAsync(
        int assessmentId, AssessmentStatusUpdateDto dto, string callerRole, int callerId);
}

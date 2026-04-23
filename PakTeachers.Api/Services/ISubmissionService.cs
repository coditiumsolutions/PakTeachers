using PakTeachers.Api.DTOs;
using PakTeachers.Api.Wrappers;

namespace PakTeachers.Api.Services;

public interface ISubmissionService
{
    Task<ApiResponse<PagedResult<SubmissionDetailDto>>> GetSubmissionsAsync(int page, int pageSize, string? callerRole, int callerId);
    Task<ApiResponse<SubmissionDetailDto>> CreateSubmissionAsync(SubmissionCreateDto dto, int studentId);
    Task<ApiResponse<SubmissionDetailDto>> GradeSubmissionAsync(int submissionId, SubmissionGradeDto dto, string? callerRole, int callerId);
    Task<ApiResponse<IEnumerable<SubmissionSummaryDto>>> GetSubmissionsByAssessmentAsync(int assessmentId, string? callerRole, int callerId);
    Task<ApiResponse<IEnumerable<SubmissionDetailDto>>> GetSubmissionsByStudentAsync(int studentId, string? callerRole, int callerId);
}

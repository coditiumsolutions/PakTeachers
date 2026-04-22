using PakTeachers.Api.DTOs;

namespace PakTeachers.Api.Services;

public interface ITrialClassService
{
    Task<ApiResponse<IEnumerable<TrialClassSummaryDto>>> GetTrialClassesAsync(
        string? statusFilter, bool? converted, int? teacherId,
        string? callerRole, int callerId);

    Task<ApiResponse<TrialClassDetailDto>> GetTrialClassAsync(
        int trialId, string? callerRole, int callerId);

    Task<ApiResponse<TrialClassDetailDto>> CreateTrialClassAsync(
        TrialClassCreateDto dto, string callerRole, int callerId);

    Task<ApiResponse<object>> UpdateTrialClassStatusAsync(
        int trialId, TrialClassStatusUpdateDto dto, string callerRole, int callerId);

    Task<ApiResponse<object>> ConvertTrialClassAsync(
        int trialId, TrialClassConvertDto dto, string callerRole, int callerId);
}

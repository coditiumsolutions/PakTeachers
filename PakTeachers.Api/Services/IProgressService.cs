using PakTeachers.Api.DTOs;
using PakTeachers.Api.Wrappers;

namespace PakTeachers.Api.Services;

public interface IProgressService
{
    Task<ApiResponse<StudentProgressSummaryDto>> GetStudentProgressAsync(int studentId, string? callerRole, int callerId);
    Task<ApiResponse<CourseProgressDetailDto>> GetStudentCourseProgressAsync(int studentId, int courseId, string? callerRole, int callerId);
    Task<ApiResponse<ProgressItemDto>> UpsertProgressAsync(ProgressCreateDto dto, string? callerRole, int callerId);
    Task<ApiResponse<ProgressItemDto>> PatchProgressAsync(int progressId, ProgressUpsertDto dto, string? callerRole, int callerId);
}

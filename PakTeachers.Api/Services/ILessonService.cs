using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;

namespace PakTeachers.Api.Services;

public interface ILessonService
{
    Task<ApiResponse<IEnumerable<LessonSummaryDto>>> GetLessonsAsync(int moduleId, string? callerRole, int callerId);
    Task<ApiResponse<LessonDetailDto>> GetLessonAsync(int lessonId, string? callerRole, int callerId);
    Task<ApiResponse<LessonSummaryDto>> CreateLessonAsync(int moduleId, LessonCreateDto dto, string callerRole, int callerId);
    Task<ApiResponse<object>> UpdateLessonAsync(int lessonId, LessonUpdateDto dto, string callerRole, int callerId);
    Task<ApiResponse<object>> UpdateLessonStatusAsync(int lessonId, LessonStatusUpdateDto dto, string callerRole, int callerId);
    Task<ApiResponse<object>> DeleteLessonAsync(int lessonId, string callerRole);
    Task<bool> LessonExistsAsync(int lessonId);
}

using PakTeachers.Api.DTOs;

namespace PakTeachers.Api.Services;

public interface ILiveSessionService
{
    Task<ApiResponse<IEnumerable<LiveSessionSummaryDto>>> GetUpcomingSessionsAsync(
        string? callerRole, int callerId);

    Task<ApiResponse<LiveSessionDetailDto>> GetSessionAsync(
        int sessionId, string? callerRole, int callerId);

    Task<ApiResponse<IEnumerable<LiveSessionDetailDto>>> GetSessionsByLessonAsync(
        int lessonId, string? callerRole, int callerId);

    Task<ApiResponse<LiveSessionDetailDto>> CreateSessionAsync(
        LiveSessionCreateDto dto, string callerRole, int callerId);

    Task<ApiResponse<object>> UpdateSessionStatusAsync(
        int sessionId, LiveSessionStatusUpdateDto dto, string callerRole, int callerId);
}

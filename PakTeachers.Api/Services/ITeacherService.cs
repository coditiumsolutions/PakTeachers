using PakTeachers.Api.DTOs;

namespace PakTeachers.Api.Services;

public interface ITeacherService
{
    Task<ApiResponse<TeacherResponseDTO>> CreateTeacherAsync(TeacherCreateDTO dto, int createdBy);
    Task<ApiResponse<IEnumerable<TeacherResponseDTO>>> GetTeachersFullAsync(string? type, string? status, string? search);
    Task<ApiResponse<IEnumerable<TeacherPublicResponseDTO>>> GetTeachersPublicAsync(string? type, string? status, string? search);
    Task<bool> TeacherExistsAsync(int teacherId);
    Task<ApiResponse<IEnumerable<TeacherCourseSummaryDTO>>> GetTeacherCoursesAsync(int teacherId);
    Task<ApiResponse<IEnumerable<LiveSessionTeacherViewDTO>>> GetTeacherLiveSessionsAsync(int teacherId);
    Task<ApiResponse<IEnumerable<TrialClassTeacherViewDTO>>> GetTeacherTrialClassesAsync(int teacherId);
    Task<ApiResponse<TeacherDashboardDTO>> GetTeacherDashboardAsync(int teacherId, bool isAdmin);
}

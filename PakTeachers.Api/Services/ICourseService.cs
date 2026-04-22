using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;

namespace PakTeachers.Api.Services;

public interface ICourseService
{
    Task<ApiResponse<(IEnumerable<object> Items, int TotalCount)>> GetCoursesAsync(
        string? callerRole, int? callerTeacherId,
        string? type, string? gradeLevel, string? status, int? teacherId, string? search,
        bool includeDeleted, int page, int pageSize);

    Task<bool> CourseExistsAsync(int courseId);
    Task<Course?> GetCourseRawAsync(int courseId);

    Task<ApiResponse<CourseAdminDto>> CreateCourseAsync(CourseCreateDto dto, string callerRole, int callerId);
    Task<ApiResponse<object>> UpdateCourseAsync(int courseId, CourseUpdateDto dto, string callerRole, int callerId);
    Task<ApiResponse<object>> UpdateCourseStatusAsync(int courseId, CourseStatusUpdateDto dto, string callerRole, int callerId);
    Task<ApiResponse<object>> DeleteCourseAsync(int courseId, string callerRole, int callerId);

    Task<ApiResponse<IEnumerable<CourseModuleDto>>> GetModulesAsync(int courseId, string callerRole, int callerId);
    Task<ApiResponse<IEnumerable<object>>> GetEnrollmentsAsync(int courseId, string callerRole, int callerId);
    Task<ApiResponse<IEnumerable<CourseStudentDto>>> GetStudentsAsync(int courseId, string callerRole, int callerId);
}

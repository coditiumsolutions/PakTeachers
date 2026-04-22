using PakTeachers.Api.DTOs;

namespace PakTeachers.Api.Services;

public interface IAdminService
{
    Task<ApiResponse<(IEnumerable<AdminResponseDTO> Items, int TotalCount)>> GetAdminsAsync(
        string? status, string? role, string? search, int page, int pageSize);

    Task<bool> AdminExistsAsync(int adminId);
    Task<AdminResponseDTO?> GetAdminAsync(int adminId);

    Task<ApiResponse<AdminCreateResponseDTO>> CreateAdminAsync(AdminCreateDTO dto);
    Task<ApiResponse<AdminResponseDTO>> UpdateAdminAsync(int adminId, AdminUpdateDTO dto);
    Task<ApiResponse<AdminResponseDTO>> UpdateAdminStatusAsync(int adminId, string newStatus, string? reason, int callerId);

    Task<ApiResponse<PasswordResetResponseDTO>> ResetTeacherPasswordAsync(int adminId, int teacherId);
    Task<ApiResponse<PasswordResetResponseDTO>> ResetStudentPasswordAsync(int adminId, int studentId);
}

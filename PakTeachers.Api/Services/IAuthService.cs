using PakTeachers.Api.DTOs;

namespace PakTeachers.Api.Services;

public interface IAuthService
{
    Task<ApiResponse<AuthResponseDTO>> LoginAsync(LoginDTO dto);
    Task<ApiResponse<UserProfileDTO>> GetUserProfileAsync(int userId, string role);
    Task<ApiResponse<object>> ChangePasswordAsync(int userId, string role, string currentPassword, string newPassword);
    Task<ApiResponse<string>> LogoutAsync(int userId);
}

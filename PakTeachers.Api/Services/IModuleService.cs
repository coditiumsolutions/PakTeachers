using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;

namespace PakTeachers.Api.Services;

public interface IModuleService
{
    Task<ApiResponse<IEnumerable<ModuleSummaryDto>>> GetModulesAsync(int courseId, string? callerRole, int callerId);
    Task<ApiResponse<ModuleDetailDto>> GetModuleAsync(int moduleId, string? callerRole, int callerId);
    Task<ApiResponse<ModuleSummaryDto>> CreateModuleAsync(int courseId, ModuleCreateDto dto, string callerRole, int callerId);
    Task<ApiResponse<object>> UpdateModuleAsync(int moduleId, ModuleUpdateDto dto, string callerRole, int callerId);
    Task<ApiResponse<object>> UpdateModuleStatusAsync(int moduleId, ModuleStatusUpdateDto dto, string callerRole, int callerId);
    Task<ApiResponse<object>> DeleteModuleAsync(int moduleId, string callerRole);
    Task<bool> ModuleExistsAsync(int moduleId);
    Task<Module?> GetModuleRawAsync(int moduleId);
}

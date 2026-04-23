using PakTeachers.Api.DTOs;
using PakTeachers.Api.Wrappers;

namespace PakTeachers.Api.Services;

public interface IConfigurationService
{
    /// <summary>Returns active values for a key ordered by order (from cache). Null if key not found.</summary>
    IEnumerable<ConfigValueDto>? GetConfigsByKey(string key);

    /// <summary>Returns all keys with full unfiltered values (from DB).</summary>
    Task<IEnumerable<ConfigurationAdminDto>> GetAllGroupedAsync();

    /// <summary>Returns true if value exists and is active for the key (in-memory).</summary>
    bool IsValid(string key, string value);

    /// <summary>Produces a 422-style error message for an invalid config value.</summary>
    string InvalidMessage(string key, string value);

    /// <summary>Loads or reloads the entire Configurations table into the cache.</summary>
    Task RefreshCacheAsync();

    Task<ApiResponse<ConfigurationAdminDto>> CreateConfigAsync(ConfigCreateDto dto);
    Task<ApiResponse<ConfigurationAdminDto>> UpdateMetaAsync(string key, ConfigUpdateMetaDto dto);
    Task<ApiResponse<object>> DeleteConfigAsync(string key);
    Task<ApiResponse<ConfigurationAdminDto>> AppendValueAsync(string key, ConfigValueAppendDto dto);
    Task<ApiResponse<ConfigurationAdminDto>> ToggleValueAsync(string key, string value);
    Task<ApiResponse<ConfigurationAdminDto>> RemoveValueAsync(string key, string value);
}

using PakTeachers.Api.DTOs;
using PakTeachers.Api.Wrappers;

namespace PakTeachers.Api.Services;

public interface IConfigurationService
{
    /// <summary>Returns active values for a key ordered by sort_order (from cache).</summary>
    IEnumerable<ConfigValueDto> GetConfigsByKey(string key);

    /// <summary>Returns true if value exists and is active for the key (in-memory).</summary>
    bool IsValid(string key, string value);

    /// <summary>Produces a 422-style error message for an invalid config value.</summary>
    string InvalidMessage(string key, string value);

    /// <summary>Loads or reloads the entire Configurations table into the cache.</summary>
    Task RefreshCacheAsync();

    Task<ApiResponse<ConfigurationAdminDto>> UpsertConfigValueAsync(int id, ConfigValueUpsertDto dto);
}

using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Wrappers;

namespace PakTeachers.Api.Services;

public class ConfigurationService(PakTeachersDbContext db, IMemoryCache cache) : IConfigurationService
{
    private const string CacheKeyPrefix = "cfg:";

    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNameCaseInsensitive = true
    };

    // Represents one item inside the config_values JSON array
    private sealed class ConfigItem
    {
        [JsonPropertyName("value")]  public string Value  { get; set; } = "";
        [JsonPropertyName("label")]  public string Label  { get; set; } = "";
        [JsonPropertyName("order")]  public int    Order  { get; set; }
        [JsonPropertyName("active")] public bool   Active { get; set; } = true;
    }

    // ── PUBLIC API ─────────────────────────────────────────────────────────────

    public IEnumerable<ConfigValueDto> GetConfigsByKey(string key)
    {
        var cacheKey = CacheKeyPrefix + key.ToLowerInvariant();
        if (cache.TryGetValue(cacheKey, out List<ConfigValueDto>? cached) && cached is not null)
            return cached;

        return [];
    }

    public bool IsValid(string key, string value)
    {
        var cacheKey = CacheKeyPrefix + key.ToLowerInvariant();
        if (!cache.TryGetValue(cacheKey, out List<ConfigValueDto>? items) || items is null)
            return false;

        return items.Any(x => x.Value.Equals(value, StringComparison.OrdinalIgnoreCase));
    }

    public string InvalidMessage(string key, string value) =>
        $"Invalid value '{value}' for configuration key '{key}'.";

    // ── CACHE LOAD / REFRESH ───────────────────────────────────────────────────

    public async Task RefreshCacheAsync()
    {
        var rows = await db.Configurations.AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.ConfigKey)
            .ToListAsync();

        foreach (var row in rows)
        {
            try
            {
                var items = ParseValues(row.ConfigValues);
                cache.Set(CacheKeyPrefix + row.ConfigKey.ToLowerInvariant(), items,
                    new MemoryCacheEntryOptions { Priority = CacheItemPriority.NeverRemove });
            }
            catch (JsonException ex)
            {
                Console.Error.WriteLine(
                    $"[ConfigurationService] Malformed JSON for key '{row.ConfigKey}': {ex.Message}");
            }
        }
    }

    // ── UPSERT SINGLE VALUE ────────────────────────────────────────────────────

    public async Task<ApiResponse<ConfigurationAdminDto>> UpsertConfigValueAsync(
        int id, ConfigValueUpsertDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Value))
            return new ApiResponse<ConfigurationAdminDto>("'value' must not be empty.");
        if (string.IsNullOrWhiteSpace(dto.Label))
            return new ApiResponse<ConfigurationAdminDto>("'label' must not be empty.");

        var config = await db.Configurations.FindAsync(id);
        if (config is null)
            return new ApiResponse<ConfigurationAdminDto>("Configuration not found.");

        List<ConfigItem> items;
        try { items = JsonSerializer.Deserialize<List<ConfigItem>>(config.ConfigValues, JsonOpts) ?? []; }
        catch (JsonException ex)
        {
            return new ApiResponse<ConfigurationAdminDto>(
                $"Stored config_values is malformed JSON: {ex.Message}");
        }

        bool isUpdate = false;
        var existing = items.FirstOrDefault(
            i => i.Value.Equals(dto.Value, StringComparison.OrdinalIgnoreCase));

        if (existing is not null)
        {
            existing.Label  = dto.Label;
            existing.Active = dto.Active;
            isUpdate = true;
        }
        else
        {
            var nextOrder = items.Count > 0 ? items.Max(i => i.Order) + 1 : 0;
            items.Add(new ConfigItem
            {
                Value  = dto.Value,
                Label  = dto.Label,
                Order  = nextOrder,
                Active = dto.Active
            });
        }

        config.ConfigValues = JsonSerializer.Serialize(items, JsonOpts);
        config.UpdatedAt    = DateTime.UtcNow;

        try { await db.SaveChangesAsync(); }
        catch (Exception ex)
        {
            return new ApiResponse<ConfigurationAdminDto>(
                $"Failed to save changes: {ex.Message}");
        }

        await RefreshCacheAsync();

        var verb = isUpdate ? "updated in" : "added to";
        var message = $"Value '{dto.Value}' successfully {verb} '{config.ConfigKey}' configuration.";

        var allValues = items
            .OrderBy(i => i.Order)
            .Select(i => new ConfigValueFullDto
            {
                Value  = i.Value,
                Label  = i.Label,
                Order  = i.Order,
                Active = i.Active
            });

        return new ApiResponse<ConfigurationAdminDto>(new ConfigurationAdminDto
        {
            ConfigId    = config.ConfigId,
            ConfigKey   = config.ConfigKey,
            Description = config.Description,
            IsActive    = config.IsActive,
            UpdatedAt   = config.UpdatedAt,
            Values      = allValues
        }, message);
    }

    // ── HELPERS ────────────────────────────────────────────────────────────────

    private async Task RefreshKeyAsync(Models.Configuration config)
    {
        // Re-read from DB to ensure cache matches persisted state
        var row = await db.Configurations.AsNoTracking()
            .FirstOrDefaultAsync(c => c.ConfigId == config.ConfigId);

        if (row is null || !row.IsActive)
        {
            cache.Remove(CacheKeyPrefix + config.ConfigKey.ToLowerInvariant());
            return;
        }

        try
        {
            var items = ParseValues(row.ConfigValues);
            cache.Set(CacheKeyPrefix + row.ConfigKey.ToLowerInvariant(), items,
                new MemoryCacheEntryOptions { Priority = CacheItemPriority.NeverRemove });
        }
        catch (JsonException ex)
        {
            Console.Error.WriteLine(
                $"[ConfigurationService] Malformed JSON for key '{row.ConfigKey}': {ex.Message}");
        }
    }

    private static List<ConfigValueDto> ParseValues(string json)
    {
        var items = JsonSerializer.Deserialize<List<ConfigItem>>(json, JsonOpts) ?? [];
        return items
            .Where(i => i.Active)
            .OrderBy(i => i.Order)
            .Select(i => new ConfigValueDto { Value = i.Value, Label = i.Label })
            .ToList();
    }
}

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

    // Keys whose values are referenced by other tables — cannot be deleted
    private static readonly HashSet<string> ProtectedKeys = new(StringComparer.OrdinalIgnoreCase)
    {
        "payment_method",
        "grade_level",
        "city",
        "enrollment_status",
        "course_type",
        "teacher_type",
        "assessment_type",
        "lesson_content_type",
        "trial_status",
        "student_status",
        "teacher_status",
        "payment_status",
        "course_status",
        "assessment_status"
    };

    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private sealed class ConfigItem
    {
        [JsonPropertyName("value")]  public string Value  { get; set; } = "";
        [JsonPropertyName("label")]  public string Label  { get; set; } = "";
        [JsonPropertyName("order")]  public int    Order  { get; set; }
        [JsonPropertyName("active")] public bool   Active { get; set; } = true;
    }

    // ── PUBLIC READ ────────────────────────────────────────────────────────────

    public IEnumerable<ConfigValueDto>? GetConfigsByKey(string key)
    {
        var cacheKey = CacheKeyPrefix + key.ToLowerInvariant();
        return cache.TryGetValue(cacheKey, out List<ConfigValueDto>? cached) && cached is not null
            ? cached
            : null;
    }

    public async Task<IEnumerable<ConfigurationAdminDto>> GetAllGroupedAsync()
    {
        var rows = await db.Configurations.AsNoTracking()
            .OrderBy(c => c.ConfigKey)
            .ToListAsync();

        return rows.Select(row =>
        {
            List<ConfigItem> items;
            try { items = JsonSerializer.Deserialize<List<ConfigItem>>(row.ConfigValues, JsonOpts) ?? []; }
            catch { items = []; }

            return new ConfigurationAdminDto
            {
                ConfigId    = row.ConfigId,
                ConfigKey   = row.ConfigKey,
                Description = row.Description,
                IsActive    = row.IsActive,
                UpdatedAt   = row.UpdatedAt,
                Values      = items.OrderBy(i => i.Order)
                                   .Select(i => new ConfigValueFullDto
                                   {
                                       Value  = i.Value,
                                       Label  = i.Label,
                                       Order  = i.Order,
                                       Active = i.Active
                                   })
            };
        });
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

    // ── CACHE ──────────────────────────────────────────────────────────────────

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

    // ── CREATE ─────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<ConfigurationAdminDto>> CreateConfigAsync(ConfigCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.ConfigKey))
            return new ApiResponse<ConfigurationAdminDto>("'configKey' must not be empty.");

        var normalizedKey = dto.ConfigKey.Trim().ToLowerInvariant();

        var exists = await db.Configurations
            .AnyAsync(c => c.ConfigKey == normalizedKey);
        if (exists)
            return new ApiResponse<ConfigurationAdminDto>(
                $"Configuration key '{normalizedKey}' already exists.");

        // Validate and build initial values array
        var items = new List<ConfigItem>();
        for (int i = 0; i < dto.Values.Count; i++)
        {
            var v = dto.Values[i];
            if (string.IsNullOrWhiteSpace(v.Value))
                return new ApiResponse<ConfigurationAdminDto>($"Values[{i}].value must not be empty.");
            if (string.IsNullOrWhiteSpace(v.Label))
                return new ApiResponse<ConfigurationAdminDto>($"Values[{i}].label must not be empty.");

            items.Add(new ConfigItem
            {
                Value  = v.Value.Trim(),
                Label  = v.Label.Trim(),
                Order  = i,
                Active = v.Active
            });
        }

        var config = new Models.Configuration
        {
            ConfigKey    = normalizedKey,
            Description  = dto.Description?.Trim(),
            IsActive     = dto.IsActive,
            ConfigValues = JsonSerializer.Serialize(items, JsonOpts),
            UpdatedAt    = DateTime.UtcNow
        };

        db.Configurations.Add(config);
        try { await db.SaveChangesAsync(); }
        catch (Exception ex)
        {
            return new ApiResponse<ConfigurationAdminDto>($"Failed to save: {ex.Message}");
        }

        await RefreshCacheAsync();

        return new ApiResponse<ConfigurationAdminDto>(ToAdminDto(config, items),
            $"Configuration '{normalizedKey}' created successfully.");
    }

    // ── UPDATE METADATA ────────────────────────────────────────────────────────

    public async Task<ApiResponse<ConfigurationAdminDto>> UpdateMetaAsync(string key, ConfigUpdateMetaDto dto)
    {
        var config = await db.Configurations
            .FirstOrDefaultAsync(c => c.ConfigKey == key.ToLowerInvariant());
        if (config is null)
            return new ApiResponse<ConfigurationAdminDto>("Configuration not found.");

        string? warning = null;
        if (!dto.IsActive && ProtectedKeys.Contains(key))
            warning = $"Warning: '{key}' is a protected key used across the application. Deactivating it may break dependent features.";

        config.Description = dto.Description?.Trim();
        config.IsActive    = dto.IsActive;
        config.UpdatedAt   = DateTime.UtcNow;

        try { await db.SaveChangesAsync(); }
        catch (Exception ex)
        {
            return new ApiResponse<ConfigurationAdminDto>($"Failed to save: {ex.Message}");
        }

        await RefreshCacheAsync();

        var items = DeserializeItems(config.ConfigValues);
        var message = warning ?? $"Configuration '{key}' updated successfully.";
        return new ApiResponse<ConfigurationAdminDto>(ToAdminDto(config, items), message);
    }

    // ── DELETE ─────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> DeleteConfigAsync(string key)
    {
        var normalizedKey = key.ToLowerInvariant();

        if (ProtectedKeys.Contains(normalizedKey))
            return new ApiResponse<object>($"Configuration key '{normalizedKey}' is protected and cannot be deleted.");

        var config = await db.Configurations
            .FirstOrDefaultAsync(c => c.ConfigKey == normalizedKey);
        if (config is null)
            return new ApiResponse<object>("Configuration not found.");

        // Dynamic reference check
        var items = DeserializeItems(config.ConfigValues);
        var values = items.Select(i => i.Value).ToList();
        var refCount = await CountReferencesAsync(normalizedKey, values);
        if (refCount > 0)
            return new ApiResponse<object>(
                $"Cannot delete '{normalizedKey}': {refCount} record(s) across application tables reference its values. Use PUT to deactivate instead.");

        db.Configurations.Remove(config);
        try { await db.SaveChangesAsync(); }
        catch (Exception ex)
        {
            return new ApiResponse<object>($"Failed to delete: {ex.Message}");
        }

        cache.Remove(CacheKeyPrefix + normalizedKey);

        return new ApiResponse<object>(new { deleted = normalizedKey },
            $"Configuration '{normalizedKey}' deleted successfully.");
    }

    // ── APPEND VALUE ───────────────────────────────────────────────────────────

    public async Task<ApiResponse<ConfigurationAdminDto>> AppendValueAsync(string key, ConfigValueAppendDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Value))
            return new ApiResponse<ConfigurationAdminDto>("'value' must not be empty.");
        if (string.IsNullOrWhiteSpace(dto.Label))
            return new ApiResponse<ConfigurationAdminDto>("'label' must not be empty.");

        var config = await db.Configurations
            .FirstOrDefaultAsync(c => c.ConfigKey == key.ToLowerInvariant());
        if (config is null)
            return new ApiResponse<ConfigurationAdminDto>("Configuration not found.");

        var items = DeserializeItemsOrError(config.ConfigValues, out var parseError);
        if (parseError is not null)
            return new ApiResponse<ConfigurationAdminDto>(parseError);

        var duplicate = items.Any(i => i.Value.Equals(dto.Value, StringComparison.OrdinalIgnoreCase));
        if (duplicate)
            return new ApiResponse<ConfigurationAdminDto>(
                $"Value '{dto.Value}' already exists in '{key}'. Use toggle to change its active state.");

        var order = dto.Order ?? (items.Count > 0 ? items.Max(i => i.Order) + 1 : 0);
        items.Add(new ConfigItem
        {
            Value  = dto.Value.Trim(),
            Label  = dto.Label.Trim(),
            Order  = order,
            Active = dto.Active
        });

        return await PersistAndRefresh(config, items,
            $"Value '{dto.Value}' appended to '{key}' successfully.");
    }

    // ── TOGGLE VALUE ───────────────────────────────────────────────────────────

    public async Task<ApiResponse<ConfigurationAdminDto>> ToggleValueAsync(string key, string value)
    {
        var config = await db.Configurations
            .FirstOrDefaultAsync(c => c.ConfigKey == key.ToLowerInvariant());
        if (config is null)
            return new ApiResponse<ConfigurationAdminDto>("Configuration not found.");

        var items = DeserializeItemsOrError(config.ConfigValues, out var parseError);
        if (parseError is not null)
            return new ApiResponse<ConfigurationAdminDto>(parseError);

        var item = items.FirstOrDefault(i => i.Value.Equals(value, StringComparison.OrdinalIgnoreCase));
        if (item is null)
            return new ApiResponse<ConfigurationAdminDto>(
                $"Value '{value}' not found in configuration '{key}'.");

        item.Active = !item.Active;
        var state = item.Active ? "activated" : "deactivated";

        return await PersistAndRefresh(config, items,
            $"Value '{value}' in '{key}' has been {state}.");
    }

    // ── REMOVE VALUE ───────────────────────────────────────────────────────────

    public async Task<ApiResponse<ConfigurationAdminDto>> RemoveValueAsync(string key, string value)
    {
        var config = await db.Configurations
            .FirstOrDefaultAsync(c => c.ConfigKey == key.ToLowerInvariant());
        if (config is null)
            return new ApiResponse<ConfigurationAdminDto>("Configuration not found.");

        var items = DeserializeItemsOrError(config.ConfigValues, out var parseError);
        if (parseError is not null)
            return new ApiResponse<ConfigurationAdminDto>(parseError);

        var item = items.FirstOrDefault(i => i.Value.Equals(value, StringComparison.OrdinalIgnoreCase));
        if (item is null)
            return new ApiResponse<ConfigurationAdminDto>(
                $"Value '{value}' not found in configuration '{key}'.");

        // Reference check before hard-remove
        var refCount = await CountReferencesAsync(key.ToLowerInvariant(), [value]);
        if (refCount > 0)
            return new ApiResponse<ConfigurationAdminDto>(
                $"Cannot remove '{value}': {refCount} record(s) reference this value. Use PATCH /{key}/values/{value}/toggle to deactivate it instead.");

        items.Remove(item);

        return await PersistAndRefresh(config, items,
            $"Value '{value}' removed from '{key}' successfully.");
    }

    // ── HELPERS ────────────────────────────────────────────────────────────────

    private async Task<ApiResponse<ConfigurationAdminDto>> PersistAndRefresh(
        Models.Configuration config, List<ConfigItem> items, string message)
    {
        config.ConfigValues = JsonSerializer.Serialize(items, JsonOpts);
        config.UpdatedAt    = DateTime.UtcNow;

        try { await db.SaveChangesAsync(); }
        catch (Exception ex)
        {
            return new ApiResponse<ConfigurationAdminDto>($"Failed to save: {ex.Message}");
        }

        await RefreshCacheAsync();
        return new ApiResponse<ConfigurationAdminDto>(ToAdminDto(config, items), message);
    }

    private static ConfigurationAdminDto ToAdminDto(Models.Configuration config, List<ConfigItem> items) =>
        new()
        {
            ConfigId    = config.ConfigId,
            ConfigKey   = config.ConfigKey,
            Description = config.Description,
            IsActive    = config.IsActive,
            UpdatedAt   = config.UpdatedAt,
            Values      = items.OrderBy(i => i.Order)
                               .Select(i => new ConfigValueFullDto
                               {
                                   Value  = i.Value,
                                   Label  = i.Label,
                                   Order  = i.Order,
                                   Active = i.Active
                               })
        };

    private static List<ConfigValueDto> ParseValues(string json)
    {
        var items = JsonSerializer.Deserialize<List<ConfigItem>>(json, JsonOpts) ?? [];
        return items
            .Where(i => i.Active)
            .OrderBy(i => i.Order)
            .Select(i => new ConfigValueDto { Value = i.Value, Label = i.Label })
            .ToList();
    }

    private static List<ConfigItem> DeserializeItems(string json)
    {
        try { return JsonSerializer.Deserialize<List<ConfigItem>>(json, JsonOpts) ?? []; }
        catch { return []; }
    }

    private static List<ConfigItem> DeserializeItemsOrError(string json, out string? error)
    {
        try
        {
            error = null;
            return JsonSerializer.Deserialize<List<ConfigItem>>(json, JsonOpts) ?? [];
        }
        catch (JsonException ex)
        {
            error = $"Stored config_values is malformed JSON: {ex.Message}";
            return [];
        }
    }

    /// <summary>
    /// Counts how many rows across application tables store any of the given values
    /// for the specified config key. Only checks known key-to-column mappings.
    /// </summary>
    private async Task<int> CountReferencesAsync(string key, IEnumerable<string> values)
    {
        var valueList = values.ToList();
        if (valueList.Count == 0) return 0;

        int count = 0;

        switch (key)
        {
            case "grade_level":
                count += await db.Students.CountAsync(s => valueList.Contains(s.GradeLevel));
                count += await db.Courses.CountAsync(c => c.GradeLevel != null && valueList.Contains(c.GradeLevel));
                break;
            case "city":
                count += await db.Students.CountAsync(s => s.City != null && valueList.Contains(s.City));
                break;
            case "payment_method":
                count += await db.Payments.CountAsync(p => valueList.Contains(p.Method));
                break;
            case "enrollment_status":
                count += await db.Enrollments.CountAsync(e => valueList.Contains(e.Status));
                break;
            case "course_type":
                count += await db.Courses.CountAsync(c => valueList.Contains(c.CourseType));
                break;
            case "teacher_type":
                count += await db.Teachers.CountAsync(t => valueList.Contains(t.TeacherType));
                break;
            case "assessment_type":
                count += await db.Assessments.CountAsync(a => valueList.Contains(a.AssessmentType));
                break;
            case "student_status":
                count += await db.Students.CountAsync(s => valueList.Contains(s.Status));
                break;
            case "teacher_status":
                count += await db.Teachers.CountAsync(t => valueList.Contains(t.Status));
                break;
            case "payment_status":
                count += await db.Payments.CountAsync(p => valueList.Contains(p.Status));
                break;
            case "course_status":
                count += await db.Courses.CountAsync(c => valueList.Contains(c.Status));
                break;
            case "trial_status":
                count += await db.TrialClasses.CountAsync(t => valueList.Contains(t.Status));
                break;
            case "assessment_status":
                count += await db.Assessments.CountAsync(a => valueList.Contains(a.Status));
                break;
        }

        return count;
    }
}

namespace PakTeachers.Api.DTOs;

// Used by public GET /api/configurations/{key} — active items only
public class ConfigValueDto
{
    public string Value { get; set; } = "";
    public string Label { get; set; } = "";
}

// Full item shape returned to admins — includes inactive flag
public class ConfigValueFullDto
{
    public string Value  { get; set; } = "";
    public string Label  { get; set; } = "";
    public int    Order  { get; set; }
    public bool   Active { get; set; }
}

// Returned by public GET — active values only
public class ConfigurationDto
{
    public int ConfigId { get; set; }
    public string ConfigKey { get; set; } = "";
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime UpdatedAt { get; set; }
    public IEnumerable<ConfigValueDto> Values { get; set; } = [];
}

// Returned by admin upsert — full state including inactive items
public class ConfigurationAdminDto
{
    public int ConfigId { get; set; }
    public string ConfigKey { get; set; } = "";
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime UpdatedAt { get; set; }
    public IEnumerable<ConfigValueFullDto> Values { get; set; } = [];
}

public class ConfigValueUpsertDto
{
    public string Value { get; set; } = "";
    public string Label { get; set; } = "";
    public bool Active { get; set; } = true;
}

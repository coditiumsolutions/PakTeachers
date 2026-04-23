namespace PakTeachers.Api.DTOs;

// Public GET active items only
public class ConfigValueDto
{
    public string Value { get; set; } = "";
    public string Label { get; set; } = "";
}

// Full item shape — includes inactive flag and order
public class ConfigValueFullDto
{
    public string Value  { get; set; } = "";
    public string Label  { get; set; } = "";
    public int    Order  { get; set; }
    public bool   Active { get; set; }
}

// Public GET /api/config?key= response
public class ConfigurationDto
{
    public int ConfigId { get; set; }
    public string ConfigKey { get; set; } = "";
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime UpdatedAt { get; set; }
    public IEnumerable<ConfigValueDto> Values { get; set; } = [];
}

// Admin grouped list item — full unfiltered state
public class ConfigurationAdminDto
{
    public int ConfigId { get; set; }
    public string ConfigKey { get; set; } = "";
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime UpdatedAt { get; set; }
    public IEnumerable<ConfigValueFullDto> Values { get; set; } = [];
}

// POST /api/config — create a new key
public class ConfigCreateDto
{
    public string ConfigKey   { get; set; } = "";
    public string? Description { get; set; }
    public bool IsActive      { get; set; } = true;
    public List<ConfigValueUpsertDto> Values { get; set; } = [];
}

// PUT /api/config/{key} — update metadata only
public class ConfigUpdateMetaDto
{
    public string? Description { get; set; }
    public bool IsActive       { get; set; } = true;
}

// PATCH /api/config/{key}/append — add a value to the array
public class ConfigValueAppendDto
{
    public string Value  { get; set; } = "";
    public string Label  { get; set; } = "";
    public int?   Order  { get; set; }
    public bool   Active { get; set; } = true;
}

// PATCH /api/config/{key}/remove — hard-remove a value
public class ConfigValueRemoveDto
{
    public string Value { get; set; } = "";
}

// Used by original upsert and internally
public class ConfigValueUpsertDto
{
    public string Value  { get; set; } = "";
    public string Label  { get; set; } = "";
    public bool   Active { get; set; } = true;
}

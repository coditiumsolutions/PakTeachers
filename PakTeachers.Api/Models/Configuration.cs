namespace PakTeachers.Api.Models;

public class Configuration
{
    public int ConfigId { get; set; }
    public string ConfigKey { get; set; } = null!;
    public string ConfigValues { get; set; } = null!;  // JSON array
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime UpdatedAt { get; set; }
}

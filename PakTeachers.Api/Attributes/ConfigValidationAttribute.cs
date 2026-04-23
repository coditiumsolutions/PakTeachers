namespace PakTeachers.Api.Attributes;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
public sealed class ConfigValidationAttribute(string configKey) : Attribute
{
    public string ConfigKey { get; } = configKey;
    public bool AllowNull { get; init; } = false;
}

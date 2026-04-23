using PakTeachers.Api.Attributes;

namespace PakTeachers.Api.DTOs;

public class TeacherCreateDTO
{
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
    public string Cnic { get; set; } = null!;
    [ConfigValidation("teacher_type")]
    public string TeacherType { get; set; } = null!;
    public string? Specialization { get; set; }
    public string? Qualification { get; set; }
}

namespace PakTeachers.Api.DTOs;

public class TeacherPublicResponseDTO
{
    public int Id { get; set; }
    public string FullName { get; set; } = null!;
    public string TeacherType { get; set; } = null!;
    public string? Specialization { get; set; }
    public string Status { get; set; } = null!;
}

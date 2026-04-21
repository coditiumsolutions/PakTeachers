namespace PakTeachers.Api.DTOs;

public class TeacherResponseDTO
{
    public int Id { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
    public string Cnic { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string TeacherType { get; set; } = null!;
    public string? Specialization { get; set; }
    public string? Qualification { get; set; }
    public string Status { get; set; } = null!;
    public DateOnly JoinedDate { get; set; }
    public int CreatedBy { get; set; }
}

using PakTeachers.Api.DTOs;

namespace PakTeachers.Api.Services;

public interface IStudentService
{
    Task<ApiResponse<StudentResponseDTO>> CreateStudentAsync(StudentCreateDTO dto, int createdBy);
    Task<ApiResponse<IEnumerable<StudentResponseDTO>>> GetStudentsAsync(string? grade, string? status, string? search);
    Task<bool> StudentExistsAsync(int studentId);

    Task<StudentAdminResponseDTO?> GetStudentAdminAsync(int studentId);
    Task<StudentSelfResponseDTO?> GetStudentSelfAsync(int studentId);

    Task<ApiResponse<StudentAdminResponseDTO>> UpdateStudentAsync(int studentId, StudentUpdateDTO dto, bool callerIsAdmin);
    Task<ApiResponse<StudentAdminResponseDTO>> UpdateStudentStatusAsync(int studentId, string newStatus);

    Task<ApiResponse<IEnumerable<EnrollmentResponseDTO>>> GetEnrollmentsAsync(int studentId, string? status);
    Task<ApiResponse<ProgressResponseDTO>> GetProgressAsync(int studentId, int? enrollmentId);
    Task<ApiResponse<IEnumerable<SubmissionResponseDTO>>> GetSubmissionsAsync(int studentId);
    Task<ApiResponse<IEnumerable<PaymentResponseDTO>>> GetPaymentsAsync(int studentId);
    Task<ApiResponse<StudentDashboardDTO>> GetStudentDashboardAsync(int studentId);
}

using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;

namespace PakTeachers.Api.Services;

public class AdminService(PakTeachersDbContext db) : IAdminService
{
    private static readonly HashSet<string> ValidRoles =
        new(StringComparer.OrdinalIgnoreCase) { "super_admin", "admin", "support" };

    private static readonly HashSet<string> ValidStatuses =
        new(StringComparer.OrdinalIgnoreCase) { "active", "inactive" };

    // ── LIST ──────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<(IEnumerable<AdminResponseDTO> Items, int TotalCount)>> GetAdminsAsync(
        string? status, string? role, string? search, int page, int pageSize)
    {
        var query = db.Admins.AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(a => a.Status == status);
        if (!string.IsNullOrWhiteSpace(role))
            query = query.Where(a => a.Role == role);
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(a => a.FullName.Contains(search) || a.Username.Contains(search));

        var total = await query.CountAsync();

        var items = await query
            .OrderBy(a => a.AdminId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => MapToDTO(a))
            .ToListAsync();

        return new ApiResponse<(IEnumerable<AdminResponseDTO>, int)>((items, total));
    }

    // ── EXISTS / GET ──────────────────────────────────────────────────────────

    public async Task<bool> AdminExistsAsync(int adminId) =>
        await db.Admins.AnyAsync(a => a.AdminId == adminId);

    public async Task<AdminResponseDTO?> GetAdminAsync(int adminId)
    {
        var admin = await db.Admins.FindAsync(adminId);
        return admin is null ? null : MapToDTO(admin);
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<AdminCreateResponseDTO>> CreateAdminAsync(AdminCreateDTO dto)
    {
        if (!ValidRoles.Contains(dto.Role))
            return new ApiResponse<AdminCreateResponseDTO>(
                $"Invalid role '{dto.Role}'. Valid values: super_admin, admin, support.");

        if (await db.Admins.AnyAsync(a => a.Email == dto.Email))
            return new ApiResponse<AdminCreateResponseDTO>("An admin with this email is already registered.");

        var username = dto.Username?.Trim();
        if (string.IsNullOrWhiteSpace(username))
            username = await GenerateUniqueUsernameAsync(dto.FullName);
        else if (await db.Admins.AnyAsync(a => a.Username == username))
            return new ApiResponse<AdminCreateResponseDTO>("Username is already taken.");

        var plainPassword = GenerateSecurePassword();
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword, workFactor: 11);

        var admin = new Admin
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Username = username,
            PasswordHash = passwordHash,
            Role = dto.Role.ToLower(),
            Status = "active"
        };

        db.Admins.Add(admin);
        await db.SaveChangesAsync();

        return new ApiResponse<AdminCreateResponseDTO>(new AdminCreateResponseDTO
        {
            AdminId = admin.AdminId,
            FullName = admin.FullName,
            Email = admin.Email,
            Username = admin.Username,
            Role = admin.Role,
            Status = admin.Status,
            CreatedAt = admin.CreatedAt,
            TemporaryPassword = plainPassword
        }, "Admin created. Share the credentials with the admin — the password will not be shown again.");
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<AdminResponseDTO>> UpdateAdminAsync(int adminId, AdminUpdateDTO dto)
    {
        var admin = await db.Admins.FindAsync(adminId);
        if (admin is null)
            return new ApiResponse<AdminResponseDTO>("Admin not found.");

        if (!string.IsNullOrWhiteSpace(dto.FullName))
            admin.FullName = dto.FullName.Trim();

        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            if (await db.Admins.AnyAsync(a => a.Email == dto.Email && a.AdminId != adminId))
                return new ApiResponse<AdminResponseDTO>("An admin with this email is already registered.");
            admin.Email = dto.Email.Trim();
        }

        await db.SaveChangesAsync();
        return new ApiResponse<AdminResponseDTO>(MapToDTO(admin));
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<AdminResponseDTO>> UpdateAdminStatusAsync(
        int adminId, string newStatus, string? reason, int callerId)
    {
        if (!ValidStatuses.Contains(newStatus))
            return new ApiResponse<AdminResponseDTO>(
                $"Invalid status '{newStatus}'. Valid values: active, inactive.");

        var admin = await db.Admins.FindAsync(adminId);
        if (admin is null)
            return new ApiResponse<AdminResponseDTO>("Admin not found.");

        // A super_admin cannot deactivate their own account
        if (adminId == callerId && newStatus.Equals("inactive", StringComparison.OrdinalIgnoreCase))
            return new ApiResponse<AdminResponseDTO>("You cannot deactivate your own account.");

        // Block if this would leave zero active super_admins
        if (admin.Role.Equals("super_admin", StringComparison.OrdinalIgnoreCase)
            && newStatus.Equals("inactive", StringComparison.OrdinalIgnoreCase))
        {
            var activeSuperAdmins = await db.Admins
                .CountAsync(a => a.Role == "super_admin" && a.Status == "active");

            if (activeSuperAdmins <= 1)
                return new ApiResponse<AdminResponseDTO>(
                    "Cannot deactivate the last active super_admin. Assign another super_admin first.");
        }

        admin.Status = newStatus.ToLower();
        await db.SaveChangesAsync();

        return new ApiResponse<AdminResponseDTO>(MapToDTO(admin),
            reason is not null ? $"Status updated. Reason: {reason}" : null);
    }

    // ── PASSWORD RESET ────────────────────────────────────────────────────────

    public async Task<ApiResponse<PasswordResetResponseDTO>> ResetTeacherPasswordAsync(int adminId, int teacherId)
    {
        var teacher = await db.Teachers.FindAsync(teacherId);
        if (teacher is null)
            return new ApiResponse<PasswordResetResponseDTO>("Teacher not found.");

        var plainPassword = GenerateSecurePassword();
        teacher.PasswordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword, workFactor: 11);
        await db.SaveChangesAsync();

        return new ApiResponse<PasswordResetResponseDTO>(new PasswordResetResponseDTO
        {
            TargetId = teacher.TeacherId,
            TargetType = "teacher",
            Username = teacher.Username,
            TemporaryPassword = plainPassword
        }, "Password reset. Share the credentials with the teacher — the password will not be shown again.");
    }

    public async Task<ApiResponse<PasswordResetResponseDTO>> ResetStudentPasswordAsync(int adminId, int studentId)
    {
        var student = await db.Students.FindAsync(studentId);
        if (student is null)
            return new ApiResponse<PasswordResetResponseDTO>("Student not found.");

        var plainPassword = GenerateSecurePassword();
        student.PasswordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword, workFactor: 11);
        await db.SaveChangesAsync();

        return new ApiResponse<PasswordResetResponseDTO>(new PasswordResetResponseDTO
        {
            TargetId = student.StudentId,
            TargetType = "student",
            Username = student.Username,
            TemporaryPassword = plainPassword
        }, "Password reset. Share the credentials with the student — the password will not be shown again.");
    }

    // ── HELPERS ───────────────────────────────────────────────────────────────

    private async Task<string> GenerateUniqueUsernameAsync(string fullName)
    {
        var base_ = fullName.ToLower()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)[0]
            .Replace(" ", "");

        if (!await db.Admins.AnyAsync(a => a.Username == base_))
            return base_;

        for (var i = 2; i < 1000; i++)
        {
            var candidate = $"{base_}.{i}";
            if (!await db.Admins.AnyAsync(a => a.Username == candidate))
                return candidate;
        }

        return $"{base_}.{Guid.NewGuid():N}"[..20];
    }

    private static string GenerateSecurePassword()
    {
        const string upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const string lower = "abcdefghijklmnopqrstuvwxyz";
        const string digits = "0123456789";
        const string special = "!@#$%^&*";
        const string all = upper + lower + digits + special;

        var chars = new char[12];
        chars[0] = upper[RandomNumberGenerator.GetInt32(upper.Length)];
        chars[1] = lower[RandomNumberGenerator.GetInt32(lower.Length)];
        chars[2] = digits[RandomNumberGenerator.GetInt32(digits.Length)];
        chars[3] = special[RandomNumberGenerator.GetInt32(special.Length)];
        for (var i = 4; i < 12; i++)
            chars[i] = all[RandomNumberGenerator.GetInt32(all.Length)];

        // Fisher-Yates shuffle
        for (var i = chars.Length - 1; i > 0; i--)
        {
            var j = RandomNumberGenerator.GetInt32(i + 1);
            (chars[i], chars[j]) = (chars[j], chars[i]);
        }

        return new string(chars);
    }

    private static AdminResponseDTO MapToDTO(Admin a) => new()
    {
        AdminId = a.AdminId,
        FullName = a.FullName,
        Email = a.Email,
        Username = a.Username,
        Role = a.Role,
        Status = a.Status,
        CreatedAt = a.CreatedAt
    };
}

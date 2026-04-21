using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;

namespace PakTeachers.Api.Services;

public class AuthService(PakTeachersDbContext db, IConfiguration config) : IAuthService
{
    public async Task<ApiResponse<AuthResponseDTO>> LoginAsync(LoginDTO dto)
    {
        string? username = null;
        string? passwordHash = null;
        string? role = null;
        int userId = 0;

        var admin = await db.Admins.FirstOrDefaultAsync(a => a.Username == dto.Username);
        if (admin is not null)
        {
            username = admin.Username;
            passwordHash = admin.PasswordHash;
            role = admin.Role;
            userId = admin.AdminId;
        }
        else
        {
            var teacher = await db.Teachers.FirstOrDefaultAsync(t => t.Username == dto.Username);
            if (teacher is not null)
            {
                username = teacher.Username;
                passwordHash = teacher.PasswordHash;
                role = "Teacher";
                userId = teacher.TeacherId;
            }
            else
            {
                var student = await db.Students.FirstOrDefaultAsync(s => s.Username == dto.Username);
                if (student is not null)
                {
                    username = student.Username;
                    passwordHash = student.PasswordHash;
                    role = "Student";
                    userId = student.StudentId;
                }
            }
        }

        if (username is null || passwordHash is null || !BCrypt.Net.BCrypt.Verify(dto.Password, passwordHash))
            return new ApiResponse<AuthResponseDTO>("Invalid username or password.");

        var token = GenerateToken(userId, username, role!);
        return new ApiResponse<AuthResponseDTO>(new AuthResponseDTO
        {
            Token = token,
            Username = username,
            Role = role!
        });
    }

    public async Task<ApiResponse<UserProfileDTO>> GetUserProfileAsync(int userId, string role)
    {
        bool isAdmin = role.Equals("super_admin", StringComparison.OrdinalIgnoreCase)
                    || role.Equals("admin", StringComparison.OrdinalIgnoreCase);

        if (isAdmin)
        {
            var admin = await db.Admins.FindAsync(userId);
            if (admin is null) return new ApiResponse<UserProfileDTO>("User not found.");
            return new ApiResponse<UserProfileDTO>(new UserProfileDTO
            {
                Id = admin.AdminId,
                Username = admin.Username,
                FullName = admin.FullName,
                Role = admin.Role
            });
        }

        if (role.Equals("teacher", StringComparison.OrdinalIgnoreCase))
        {
            var teacher = await db.Teachers.FindAsync(userId);
            if (teacher is null) return new ApiResponse<UserProfileDTO>("User not found.");
            return new ApiResponse<UserProfileDTO>(new UserProfileDTO
            {
                Id = teacher.TeacherId,
                Username = teacher.Username,
                FullName = teacher.FullName,
                Role = "Teacher"
            });
        }

        if (role.Equals("student", StringComparison.OrdinalIgnoreCase))
        {
            var student = await db.Students.FindAsync(userId);
            if (student is null) return new ApiResponse<UserProfileDTO>("User not found.");
            return new ApiResponse<UserProfileDTO>(new UserProfileDTO
            {
                Id = student.StudentId,
                Username = student.Username,
                FullName = student.FullName,
                Role = "Student"
            });
        }

        return new ApiResponse<UserProfileDTO>("Unknown role.");
    }

    public async Task<ApiResponse<object>> ChangePasswordAsync(int userId, string role, string currentPassword, string newPassword)
    {
        bool isAdmin = role.Equals("super_admin", StringComparison.OrdinalIgnoreCase)
                    || role.Equals("admin", StringComparison.OrdinalIgnoreCase);

        if (isAdmin)
        {
            var admin = await db.Admins.FindAsync(userId);
            if (admin is null) return new ApiResponse<object>("User not found.");
            if (!BCrypt.Net.BCrypt.Verify(currentPassword, admin.PasswordHash))
                return new ApiResponse<object>("Current password is incorrect.");
            admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword, workFactor: 11);
        }
        else if (role.Equals("teacher", StringComparison.OrdinalIgnoreCase))
        {
            var teacher = await db.Teachers.FindAsync(userId);
            if (teacher is null) return new ApiResponse<object>("User not found.");
            if (!BCrypt.Net.BCrypt.Verify(currentPassword, teacher.PasswordHash))
                return new ApiResponse<object>("Current password is incorrect.");
            teacher.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword, workFactor: 11);
        }
        else if (role.Equals("student", StringComparison.OrdinalIgnoreCase))
        {
            var student = await db.Students.FindAsync(userId);
            if (student is null) return new ApiResponse<object>("User not found.");
            if (!BCrypt.Net.BCrypt.Verify(currentPassword, student.PasswordHash))
                return new ApiResponse<object>("Current password is incorrect.");
            student.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword, workFactor: 11);
        }
        else
        {
            return new ApiResponse<object>("Unknown role.");
        }

        await db.SaveChangesAsync();
        return new ApiResponse<object>(new { }, "Password changed successfully.");
    }

    // Placeholder — extend this when server-side token revocation (e.g. blocklist) is introduced.
    public Task<ApiResponse<string>> LogoutAsync(int userId)
        => Task.FromResult(new ApiResponse<string>("Logged out successfully."));

    private string GenerateToken(int userId, string username, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

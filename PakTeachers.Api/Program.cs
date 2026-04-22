using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PakTeachers.Api.Authorization;
using PakTeachers.Api.Data;
using PakTeachers.Api.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PakTeachersDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("TeacherSelfOrAdmin", policy =>
        policy.RequireAssertion(ctx =>
        {
            var role = ctx.User.FindFirstValue(ClaimTypes.Role) ?? "";
            if (role.Equals("super_admin", StringComparison.OrdinalIgnoreCase)
             || role.Equals("admin", StringComparison.OrdinalIgnoreCase)
             || role.Equals("support", StringComparison.OrdinalIgnoreCase))
                return true;

            if (!role.Equals("teacher", StringComparison.OrdinalIgnoreCase))
                return false;

            var userIdClaim = ctx.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return false;

            var routeId = ctx.Resource is HttpContext http
                ? http.GetRouteValue("id")?.ToString()
                : null;

            return int.TryParse(routeId, out var routeTeacherId) && userId == routeTeacherId;
        }));

    options.AddPolicy("CourseOwnerOrAdmin", policy =>
        policy.Requirements.Add(new CourseOwnerOrAdminRequirement()));

    options.AddPolicy("StudentSelfOrAdmin", policy =>
        policy.RequireAssertion(ctx =>
        {
            var role = ctx.User.FindFirstValue(ClaimTypes.Role) ?? "";
            if (role.Equals("super_admin", StringComparison.OrdinalIgnoreCase)
             || role.Equals("admin", StringComparison.OrdinalIgnoreCase)
             || role.Equals("support", StringComparison.OrdinalIgnoreCase))
                return true;

            if (!role.Equals("student", StringComparison.OrdinalIgnoreCase))
                return false;

            var userIdClaim = ctx.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return false;

            var routeId = ctx.Resource is HttpContext http
                ? http.GetRouteValue("id")?.ToString()
                : null;

            return int.TryParse(routeId, out var routeStudentId) && userId == routeStudentId;
        }));
});
builder.Services.AddScoped<IAuthorizationHandler, CourseOwnerOrAdminHandler>();
builder.Services.AddControllers();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITeacherService, TeacherService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();


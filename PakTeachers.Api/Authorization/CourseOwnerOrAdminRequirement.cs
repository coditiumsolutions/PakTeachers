using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Data;

namespace PakTeachers.Api.Authorization;

public class CourseOwnerOrAdminRequirement : IAuthorizationRequirement { }

public class CourseOwnerOrAdminHandler(PakTeachersDbContext db)
    : AuthorizationHandler<CourseOwnerOrAdminRequirement>
{
    private static readonly HashSet<string> AdminRoles =
        new(StringComparer.OrdinalIgnoreCase) { "super_admin", "admin", "support" };

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        CourseOwnerOrAdminRequirement requirement)
    {
        var role = context.User.FindFirstValue(ClaimTypes.Role) ?? "";

        if (AdminRoles.Contains(role))
        {
            context.Succeed(requirement);
            return;
        }

        if (!role.Equals("teacher", StringComparison.OrdinalIgnoreCase))
            return; // fail — not a teacher and not an admin

        var userIdClaim = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out var userId))
            return;

        var routeId = context.Resource is HttpContext http
            ? http.GetRouteValue("id")?.ToString()
            : null;

        if (!int.TryParse(routeId, out var courseId))
            return;

        var ownerTeacherId = await db.Courses
            .Where(c => c.CourseId == courseId)
            .Select(c => (int?)c.TeacherId)
            .FirstOrDefaultAsync();

        if (ownerTeacherId == userId)
            context.Succeed(requirement);
    }
}

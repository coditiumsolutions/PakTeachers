using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;

namespace PakTeachers.Api.Services;

public class AssessmentService(PakTeachersDbContext db) : IAssessmentService
{
    private static readonly HashSet<string> AdminRoles =
        new(StringComparer.OrdinalIgnoreCase) { "super_admin", "admin", "support" };

    private static bool IsAdmin(string? role) => role is not null && AdminRoles.Contains(role);
    private static bool IsTeacher(string? role) => "teacher".Equals(role, StringComparison.OrdinalIgnoreCase);
    private static bool IsStudent(string? role) => "student".Equals(role, StringComparison.OrdinalIgnoreCase);
    private static bool IsSuperAdminOrSupport(string? role) =>
        "super_admin".Equals(role, StringComparison.OrdinalIgnoreCase) ||
        "support".Equals(role, StringComparison.OrdinalIgnoreCase);

    // ── GET LIST ──────────────────────────────────────────────────────────────

    public async Task<ApiResponse<IEnumerable<AssessmentSummaryDto>>> GetAssessmentsAsync(
        int moduleId, string? callerRole, int callerId)
    {
        var module = await db.Modules.AsNoTracking()
            .Include(m => m.Course)
            .FirstOrDefaultAsync(m => m.ModuleId == moduleId);

        if (module is null)
            return new ApiResponse<IEnumerable<AssessmentSummaryDto>>("Module not found.");

        // Enrollment gate for students
        if (IsStudent(callerRole))
        {
            bool enrolled = await db.Enrollments.AsNoTracking()
                .AnyAsync(e => e.StudentId == callerId &&
                               e.CourseId == module.CourseId &&
                               e.Status == "active");
            if (!enrolled)
                return new ApiResponse<IEnumerable<AssessmentSummaryDto>>(
                    "You are not enrolled in this course.");
        }
        // Teachers: must own the course
        else if (IsTeacher(callerRole) && module.Course.TeacherId != callerId)
        {
            return new ApiResponse<IEnumerable<AssessmentSummaryDto>>("Module not found.");
        }

        var query = db.Assessments.AsNoTracking()
            .Where(a => a.ModuleId == moduleId);

        // Students only see active assessments
        if (IsStudent(callerRole))
            query = query.Where(a => a.Status == "active");

        var items = await query
            .OrderBy(a => a.Date)
            .Select(a => new AssessmentSummaryDto
            {
                AssessmentId = a.AssessmentId,
                ModuleId = a.ModuleId,
                AssessmentType = a.AssessmentType,
                TotalMarks = a.TotalMarks,
                Passmarks = a.Passmarks,
                Weightage = a.Weightage,
                Date = a.Date,
                Status = a.Status
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<AssessmentSummaryDto>>(items);
    }

    // ── GET SINGLE ────────────────────────────────────────────────────────────

    public async Task<ApiResponse<AssessmentDetailDto>> GetAssessmentAsync(
        int assessmentId, string? callerRole, int callerId)
    {
        var assessment = await db.Assessments.AsNoTracking()
            .Include(a => a.Module)
                .ThenInclude(m => m.Course)
            .Include(a => a.CreatedByNavigation)
            .FirstOrDefaultAsync(a => a.AssessmentId == assessmentId);

        if (assessment is null)
            return new ApiResponse<AssessmentDetailDto>("Assessment not found.");

        // Enrollment gate for students
        if (IsStudent(callerRole))
        {
            bool enrolled = await db.Enrollments.AsNoTracking()
                .AnyAsync(e => e.StudentId == callerId &&
                               e.CourseId == assessment.Module.CourseId &&
                               e.Status == "active");
            if (!enrolled)
                return new ApiResponse<AssessmentDetailDto>("Assessment not found.");

            if (assessment.Status != "active")
                return new ApiResponse<AssessmentDetailDto>("Assessment not found.");
        }
        else if (IsTeacher(callerRole) && assessment.Module.Course.TeacherId != callerId)
        {
            return new ApiResponse<AssessmentDetailDto>("Assessment not found.");
        }

        MySubmissionDto? mySubmission = null;
        if (IsStudent(callerRole))
        {
            var sub = await db.AssessmentSubmissions.AsNoTracking()
                .FirstOrDefaultAsync(s => s.StudentId == callerId && s.AssessmentId == assessmentId);
            if (sub is not null)
                mySubmission = new MySubmissionDto
                {
                    SubmissionId = sub.SubmissionId,
                    Score = sub.Score,
                    SubmittedAt = sub.SubmittedAt,
                    Feedback = sub.Feedback
                };
        }

        return new ApiResponse<AssessmentDetailDto>(new AssessmentDetailDto
        {
            AssessmentId = assessment.AssessmentId,
            ModuleId = assessment.ModuleId,
            ModuleTitle = assessment.Module.Title,
            CreatedBy = assessment.CreatedBy,
            CreatedByName = assessment.CreatedByNavigation.FullName,
            AssessmentType = assessment.AssessmentType,
            TotalMarks = assessment.TotalMarks,
            Passmarks = assessment.Passmarks,
            Weightage = assessment.Weightage,
            Date = assessment.Date,
            Status = assessment.Status,
            MySubmission = mySubmission
        });
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<AssessmentDetailDto>> CreateAssessmentAsync(
        int moduleId, AssessmentCreateDto dto, string callerRole, int callerId)
    {
        var module = await db.Modules.AsNoTracking()
            .Include(m => m.Course)
            .FirstOrDefaultAsync(m => m.ModuleId == moduleId);

        if (module is null)
            return new ApiResponse<AssessmentDetailDto>("Module not found.");

        // Teachers can only create for their own courses
        if (IsTeacher(callerRole) && module.Course.TeacherId != callerId)
            return new ApiResponse<AssessmentDetailDto>("Module not found.");

        if (dto.Passmarks > dto.TotalMarks)
            return new ApiResponse<AssessmentDetailDto>("Passmarks cannot exceed TotalMarks.");

        var assessment = new Assessment
        {
            ModuleId = moduleId,
            CreatedBy = callerId,
            AssessmentType = dto.AssessmentType,
            TotalMarks = dto.TotalMarks,
            Passmarks = dto.Passmarks,
            Weightage = dto.Weightage,
            Date = dto.Date,
            Status = "draft"
        };

        db.Assessments.Add(assessment);
        await db.SaveChangesAsync();

        // Weightage warning: sum of all assessments in module
        var warnings = new List<string>();
        if (dto.Weightage.HasValue)
        {
            double totalWeightage = await db.Assessments.AsNoTracking()
                .Where(a => a.ModuleId == moduleId)
                .SumAsync(a => (double)(a.Weightage ?? 0));

            if (totalWeightage > 100)
                warnings.Add($"Total weightage for this module is now {totalWeightage:F1}%, which exceeds 100%.");
        }

        var teacher = await db.Teachers.AsNoTracking()
            .FirstOrDefaultAsync(t => t.TeacherId == callerId);

        var response = new ApiResponse<AssessmentDetailDto>(new AssessmentDetailDto
        {
            AssessmentId = assessment.AssessmentId,
            ModuleId = assessment.ModuleId,
            ModuleTitle = module.Title,
            CreatedBy = assessment.CreatedBy,
            CreatedByName = teacher?.FullName ?? "",
            AssessmentType = assessment.AssessmentType,
            TotalMarks = assessment.TotalMarks,
            Passmarks = assessment.Passmarks,
            Weightage = assessment.Weightage,
            Date = assessment.Date,
            Status = assessment.Status,
            MySubmission = null
        });
        response.Warnings = warnings;
        return response;
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<AssessmentDetailDto>> UpdateAssessmentAsync(
        int assessmentId, AssessmentUpdateDto dto, string callerRole, int callerId)
    {
        var assessment = await db.Assessments
            .Include(a => a.Module)
                .ThenInclude(m => m.Course)
            .Include(a => a.CreatedByNavigation)
            .FirstOrDefaultAsync(a => a.AssessmentId == assessmentId);

        if (assessment is null)
            return new ApiResponse<AssessmentDetailDto>("Assessment not found.");

        if (IsTeacher(callerRole) && assessment.Module.Course.TeacherId != callerId)
            return new ApiResponse<AssessmentDetailDto>("Assessment not found.");

        // Hard block: active assessment with submissions cannot change marks
        if (assessment.Status == "active")
        {
            bool hasSubmissions = await db.AssessmentSubmissions.AsNoTracking()
                .AnyAsync(s => s.AssessmentId == assessmentId);

            if (hasSubmissions && (dto.TotalMarks.HasValue || dto.Passmarks.HasValue))
                return new ApiResponse<AssessmentDetailDto>(
                    "Cannot change TotalMarks or Passmarks on an active assessment that has submissions.");
        }

        if (dto.AssessmentType is not null) assessment.AssessmentType = dto.AssessmentType;
        if (dto.TotalMarks.HasValue) assessment.TotalMarks = dto.TotalMarks.Value;
        if (dto.Passmarks.HasValue) assessment.Passmarks = dto.Passmarks.Value;
        if (dto.Weightage.HasValue) assessment.Weightage = dto.Weightage.Value;
        if (dto.Date.HasValue) assessment.Date = dto.Date.Value;

        if (assessment.Passmarks > assessment.TotalMarks)
            return new ApiResponse<AssessmentDetailDto>("Passmarks cannot exceed TotalMarks.");

        await db.SaveChangesAsync();

        return new ApiResponse<AssessmentDetailDto>(new AssessmentDetailDto
        {
            AssessmentId = assessment.AssessmentId,
            ModuleId = assessment.ModuleId,
            ModuleTitle = assessment.Module.Title,
            CreatedBy = assessment.CreatedBy,
            CreatedByName = assessment.CreatedByNavigation.FullName,
            AssessmentType = assessment.AssessmentType,
            TotalMarks = assessment.TotalMarks,
            Passmarks = assessment.Passmarks,
            Weightage = assessment.Weightage,
            Date = assessment.Date,
            Status = assessment.Status,
            MySubmission = null
        });
    }

    // ── STATUS ────────────────────────────────────────────────────────────────

    public async Task<ApiResponse<object>> UpdateAssessmentStatusAsync(
        int assessmentId, AssessmentStatusUpdateDto dto, string callerRole, int callerId)
    {
        var assessment = await db.Assessments
            .Include(a => a.Module)
                .ThenInclude(m => m.Course)
            .FirstOrDefaultAsync(a => a.AssessmentId == assessmentId);

        if (assessment is null)
            return new ApiResponse<object>("Assessment not found.");

        if (IsTeacher(callerRole) && assessment.Module.Course.TeacherId != callerId)
            return new ApiResponse<object>("Assessment not found.");

        var newStatus = dto.Status.ToLowerInvariant();
        var current = assessment.Status.ToLowerInvariant();

        switch ((current, newStatus))
        {
            case ("draft", "active"):
                break; // always allowed

            case ("active", "draft"):
                bool hasSubmissions = await db.AssessmentSubmissions.AsNoTracking()
                    .AnyAsync(s => s.AssessmentId == assessmentId);
                if (hasSubmissions)
                    return new ApiResponse<object>(
                        "Cannot revert to draft: assessment has existing submissions.");
                break;

            case ("closed", "active"):
                if (!IsSuperAdminOrSupport(callerRole))
                    return new ApiResponse<object>(
                        "Only super_admin or support can reactivate a closed assessment.");
                break;

            default:
                return new ApiResponse<object>(
                    $"Transition from '{current}' to '{newStatus}' is not allowed.");
        }

        assessment.Status = newStatus;
        await db.SaveChangesAsync();
        return new ApiResponse<object>(new { }, $"Assessment status updated to '{newStatus}'.");
    }
}

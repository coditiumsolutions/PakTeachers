using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Data;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Models;
using PakTeachers.Api.Wrappers;

namespace PakTeachers.Api.Services;

public class SubmissionService(PakTeachersDbContext db) : ISubmissionService
{
    private static readonly HashSet<string> AdminRoles =
        new(StringComparer.OrdinalIgnoreCase) { "super_admin", "admin", "support" };

    private static bool IsAdmin(string? role) => role is not null && AdminRoles.Contains(role);
    private static bool IsTeacher(string? role) => "teacher".Equals(role, StringComparison.OrdinalIgnoreCase);

    // ── PAGINATED LIST (Admin/Support: all; Teacher: own assessments) ─────────

    public async Task<ApiResponse<PagedResult<SubmissionDetailDto>>> GetSubmissionsAsync(
        int page, int pageSize, string? callerRole, int callerId)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 20;

        var query = db.AssessmentSubmissions.AsNoTracking()
            .Include(s => s.Assessment)
                .ThenInclude(a => a.Module)
                    .ThenInclude(m => m.Course)
            .Include(s => s.Student)
            .AsQueryable();

        if (IsTeacher(callerRole))
        {
            // Teachers see only submissions for assessments they created
            query = query.Where(s => s.Assessment.CreatedBy == callerId);
        }
        else if (!IsAdmin(callerRole))
        {
            return new ApiResponse<PagedResult<SubmissionDetailDto>>("Access denied.");
        }

        var total = await query.CountAsync();

        var raw = await query
            .OrderByDescending(s => s.SubmittedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var items = raw.Select(MapToDetailDto).ToList();

        return new ApiResponse<PagedResult<SubmissionDetailDto>>(new PagedResult<SubmissionDetailDto>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        });
    }

    // ── CREATE SUBMISSION (one-shot) ──────────────────────────────────────────

    public async Task<ApiResponse<SubmissionDetailDto>> CreateSubmissionAsync(
        SubmissionCreateDto dto, int studentId)
    {
        var assessment = await db.Assessments.AsNoTracking()
            .Include(a => a.Module)
                .ThenInclude(m => m.Course)
            .FirstOrDefaultAsync(a => a.AssessmentId == dto.AssessmentId);

        if (assessment is null)
            return new ApiResponse<SubmissionDetailDto>("Assessment not found.");

        if (assessment.Status != "active")
            return new ApiResponse<SubmissionDetailDto>("Assessment is not active.");

        bool enrolled = await db.Enrollments.AsNoTracking()
            .AnyAsync(e => e.StudentId == studentId &&
                           e.CourseId == assessment.Module.CourseId &&
                           e.Status == "active");
        if (!enrolled)
            return new ApiResponse<SubmissionDetailDto>("You are not enrolled in this course.");

        bool alreadySubmitted = await db.AssessmentSubmissions.AsNoTracking()
            .AnyAsync(s => s.StudentId == studentId && s.AssessmentId == dto.AssessmentId);
        if (alreadySubmitted)
            return new ApiResponse<SubmissionDetailDto>("duplicate_submission",
                new { error = "You have already submitted this assessment." });

        var student = await db.Students.AsNoTracking()
            .FirstOrDefaultAsync(s => s.StudentId == studentId);

        var submission = new AssessmentSubmission
        {
            AssessmentId = dto.AssessmentId,
            StudentId = studentId,
            SubmittedAt = DateTime.UtcNow
        };

        db.AssessmentSubmissions.Add(submission);
        await db.SaveChangesAsync();

        return new ApiResponse<SubmissionDetailDto>(new SubmissionDetailDto
        {
            SubmissionId = submission.SubmissionId,
            AssessmentId = assessment.AssessmentId,
            AssessmentType = assessment.AssessmentType,
            StudentId = studentId,
            StudentName = student?.FullName ?? "",
            Score = null,
            TotalMarks = assessment.TotalMarks,
            Passmarks = assessment.Passmarks,
            Passed = null,
            SubmittedAt = submission.SubmittedAt,
            Feedback = null,
            GradedBy = null,
            ModuleTitle = assessment.Module.Title,
            CourseTitle = assessment.Module.Course.Title
        });
    }

    // ── GRADE SUBMISSION ──────────────────────────────────────────────────────

    public async Task<ApiResponse<SubmissionDetailDto>> GradeSubmissionAsync(
        int submissionId, SubmissionGradeDto dto, string? callerRole, int callerId)
    {
        var submission = await db.AssessmentSubmissions
            .Include(s => s.Assessment)
                .ThenInclude(a => a.Module)
                    .ThenInclude(m => m.Course)
            .Include(s => s.Student)
            .FirstOrDefaultAsync(s => s.SubmissionId == submissionId);

        if (submission is null)
            return new ApiResponse<SubmissionDetailDto>("Submission not found.");

        // Teachers can only grade submissions for their own assessments
        if (IsTeacher(callerRole) && submission.Assessment.CreatedBy != callerId)
            return new ApiResponse<SubmissionDetailDto>("Submission not found.");

        if (dto.Score < 0 || dto.Score > submission.Assessment.TotalMarks)
            return new ApiResponse<SubmissionDetailDto>(
                $"Score must be between 0 and {submission.Assessment.TotalMarks}.");

        submission.Score = dto.Score;
        submission.Feedback = dto.Feedback;
        submission.GradedBy = callerId;

        await db.SaveChangesAsync();

        bool passed = dto.Score >= submission.Assessment.Passmarks;

        return new ApiResponse<SubmissionDetailDto>(new SubmissionDetailDto
        {
            SubmissionId = submission.SubmissionId,
            AssessmentId = submission.AssessmentId,
            AssessmentType = submission.Assessment.AssessmentType,
            StudentId = submission.StudentId,
            StudentName = submission.Student.FullName,
            Score = submission.Score,
            TotalMarks = submission.Assessment.TotalMarks,
            Passmarks = submission.Assessment.Passmarks,
            Passed = passed,
            SubmittedAt = submission.SubmittedAt,
            Feedback = submission.Feedback,
            GradedBy = submission.GradedBy,
            ModuleTitle = submission.Assessment.Module.Title,
            CourseTitle = submission.Assessment.Module.Course.Title
        });
    }

    // ── GET BY ASSESSMENT (teacher class-roster view) ─────────────────────────

    public async Task<ApiResponse<IEnumerable<SubmissionSummaryDto>>> GetSubmissionsByAssessmentAsync(
        int assessmentId, string? callerRole, int callerId)
    {
        var assessment = await db.Assessments.AsNoTracking()
            .Include(a => a.Module)
                .ThenInclude(m => m.Course)
            .FirstOrDefaultAsync(a => a.AssessmentId == assessmentId);

        if (assessment is null)
            return new ApiResponse<IEnumerable<SubmissionSummaryDto>>("Assessment not found.");

        // Teachers must own the assessment
        if (IsTeacher(callerRole) && assessment.CreatedBy != callerId)
            return new ApiResponse<IEnumerable<SubmissionSummaryDto>>("Assessment not found.");

        var submissions = await db.AssessmentSubmissions.AsNoTracking()
            .Include(s => s.Student)
            .Where(s => s.AssessmentId == assessmentId)
            .OrderByDescending(s => s.SubmittedAt)
            .Select(s => new SubmissionSummaryDto
            {
                SubmissionId = s.SubmissionId,
                AssessmentId = s.AssessmentId,
                AssessmentType = assessment.AssessmentType,
                StudentId = s.StudentId,
                StudentName = s.Student.FullName,
                Score = s.Score,
                TotalMarks = assessment.TotalMarks,
                Passmarks = assessment.Passmarks,
                Passed = s.Score == null ? null : s.Score >= assessment.Passmarks,
                SubmittedAt = s.SubmittedAt,
                Feedback = s.Feedback
            })
            .ToListAsync();

        return new ApiResponse<IEnumerable<SubmissionSummaryDto>>(submissions);
    }

    // ── GET BY STUDENT (student "My Results" view) ────────────────────────────

    public async Task<ApiResponse<IEnumerable<SubmissionDetailDto>>> GetSubmissionsByStudentAsync(
        int studentId, string? callerRole, int callerId)
    {
        // Students can only access their own submissions
        if (!IsAdmin(callerRole) && !IsTeacher(callerRole))
        {
            if (callerId != studentId)
                return new ApiResponse<IEnumerable<SubmissionDetailDto>>("Access denied.");
        }

        // Teachers have no scoped view here — admin/support only
        if (IsTeacher(callerRole))
            return new ApiResponse<IEnumerable<SubmissionDetailDto>>("Access denied.");

        var student = await db.Students.AsNoTracking()
            .FirstOrDefaultAsync(s => s.StudentId == studentId);
        if (student is null)
            return new ApiResponse<IEnumerable<SubmissionDetailDto>>("Student not found.");

        var raw = await db.AssessmentSubmissions.AsNoTracking()
            .Include(s => s.Assessment)
                .ThenInclude(a => a.Module)
                    .ThenInclude(m => m.Course)
            .Include(s => s.Student)
            .Where(s => s.StudentId == studentId)
            .OrderByDescending(s => s.SubmittedAt)
            .ToListAsync();

        var submissions = raw.Select(MapToDetailDto).ToList();

        return new ApiResponse<IEnumerable<SubmissionDetailDto>>(submissions);
    }

    private static SubmissionDetailDto MapToDetailDto(AssessmentSubmission s) => new()
    {
        SubmissionId = s.SubmissionId,
        AssessmentId = s.AssessmentId,
        AssessmentType = s.Assessment?.AssessmentType ?? "",
        StudentId = s.StudentId,
        StudentName = s.Student?.FullName ?? "",
        Score = s.Score,
        TotalMarks = s.Assessment?.TotalMarks ?? 0,
        Passmarks = s.Assessment?.Passmarks ?? 0,
        Passed = s.Score == null ? null : s.Score >= (s.Assessment?.Passmarks ?? 0),
        SubmittedAt = s.SubmittedAt,
        Feedback = s.Feedback,
        GradedBy = s.GradedBy,
        ModuleTitle = s.Assessment?.Module?.Title ?? "",
        CourseTitle = s.Assessment?.Module?.Course?.Title ?? ""
    };
}

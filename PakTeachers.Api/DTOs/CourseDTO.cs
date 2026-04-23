using PakTeachers.Api.Attributes;

namespace PakTeachers.Api.DTOs;

// ── COURSE RESPONSE DTOs ──────────────────────────────────────────────────────

public class CoursePublicDto
{
    public int CourseId { get; set; }
    public int TeacherId { get; set; }
    public string TeacherName { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string CourseType { get; set; } = null!;
    public string? GradeLevel { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string Status { get; set; } = null!;
}

public class CourseTeacherDto : CoursePublicDto
{
    public string? Notes { get; set; }
    public int ModuleCount { get; set; }
    public int EnrollmentCount { get; set; }
}

public class CourseAdminDto : CourseTeacherDto
{
    public int ActiveEnrollmentCount { get; set; }
    public int TotalEnrollmentCount { get; set; }
}

// ── CREATE / UPDATE DTOs ──────────────────────────────────────────────────────

public class CourseCreateDto
{
    public int? TeacherId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    [ConfigValidation("course_type")]
    public string CourseType { get; set; } = null!;
    [ConfigValidation("grade_level", AllowNull = true)]
    public string? GradeLevel { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Notes { get; set; }
}

public class CourseUpdateDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    [ConfigValidation("course_type", AllowNull = true)]
    public string? CourseType { get; set; }
    [ConfigValidation("grade_level", AllowNull = true)]
    public string? GradeLevel { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Notes { get; set; }
}

public class CourseStatusUpdateDto
{
    public string Status { get; set; } = null!;
    public string? Reason { get; set; }
}

// ── RELATIONSHIP DTOs ─────────────────────────────────────────────────────────

public class CourseModuleDto
{
    public int ModuleId { get; set; }
    public int CourseId { get; set; }
    public string Title { get; set; } = null!;
    public string? LearningObjectives { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string Status { get; set; } = null!;
    public string? Notes { get; set; }
    public int LessonCount { get; set; }
}

public class CourseEnrollmentDto
{
    public int EnrollmentId { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = null!;
    public DateOnly EnrolledDate { get; set; }
    public string Status { get; set; } = null!;
    public IEnumerable<PaymentSummaryDto> Payments { get; set; } = null!;
}

// Returned to teachers — identical shape but Payments is absent entirely
public class CourseEnrollmentTeacherDto
{
    public int EnrollmentId { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = null!;
    public DateOnly EnrolledDate { get; set; }
    public string Status { get; set; } = null!;
}

public class PaymentSummaryDto
{
    public int PaymentId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = null!;
    public string Method { get; set; } = null!;
    public DateTime PaidAt { get; set; }
    public string Status { get; set; } = null!;
}

public class CourseStudentDto
{
    public int StudentId { get; set; }
    public string StudentName { get; set; } = null!;
    public string? GradeLevel { get; set; }
    public DateOnly EnrolledDate { get; set; }
}

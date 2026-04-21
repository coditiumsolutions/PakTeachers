using System;
using System.Collections.Generic;

namespace PakTeachers.Api.Models;

public partial class Student
{
    public int StudentId { get; set; }

    public int CreatedBy { get; set; }

    public string FullName { get; set; } = null!;

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string GuardianName { get; set; } = null!;

    public string GuardianPhone { get; set; } = null!;

    public string GradeLevel { get; set; } = null!;

    public string? City { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateOnly EnrolledDate { get; set; }

    public virtual ICollection<AssessmentSubmission> AssessmentSubmissions { get; set; } = new List<AssessmentSubmission>();

    public virtual Admin CreatedByNavigation { get; set; } = null!;

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<StudentProgress> StudentProgresses { get; set; } = new List<StudentProgress>();

    public virtual ICollection<TrialClass> TrialClasses { get; set; } = new List<TrialClass>();
}

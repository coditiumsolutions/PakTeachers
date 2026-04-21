using System;
using System.Collections.Generic;

namespace PakTeachers.Api.Models;

public partial class Teacher
{
    public int TeacherId { get; set; }

    public int CreatedBy { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }

    public string Cnic { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string TeacherType { get; set; } = null!;

    public string? Specialization { get; set; }

    public string? Qualification { get; set; }

    public string Status { get; set; } = null!;

    public DateOnly JoinedDate { get; set; }

    public virtual ICollection<AssessmentSubmission> AssessmentSubmissions { get; set; } = new List<AssessmentSubmission>();

    public virtual ICollection<Assessment> Assessments { get; set; } = new List<Assessment>();

    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

    public virtual Admin CreatedByNavigation { get; set; } = null!;

    public virtual ICollection<LiveSession> LiveSessions { get; set; } = new List<LiveSession>();

    public virtual ICollection<TrialClass> TrialClasses { get; set; } = new List<TrialClass>();
}

using System;
using System.Collections.Generic;

namespace PakTeachers.Api.Models;

public partial class Course
{
    public int CourseId { get; set; }

    public int TeacherId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string CourseType { get; set; } = null!;

    public string? GradeLevel { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string Status { get; set; } = null!;

    public string? Notes { get; set; }

    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public virtual ICollection<Module> Modules { get; set; } = new List<Module>();

    public virtual Teacher Teacher { get; set; } = null!;
}

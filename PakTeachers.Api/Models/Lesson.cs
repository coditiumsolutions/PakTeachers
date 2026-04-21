using System;
using System.Collections.Generic;

namespace PakTeachers.Api.Models;

public partial class Lesson
{
    public int LessonId { get; set; }

    public int ModuleId { get; set; }

    public string Title { get; set; } = null!;

    public string ContentType { get; set; } = null!;

    public string? ContentUrl { get; set; }

    public int? LearningTime { get; set; }

    public DateOnly? Date { get; set; }

    public string Status { get; set; } = null!;

    public string? Notes { get; set; }

    public virtual ICollection<LiveSession> LiveSessions { get; set; } = new List<LiveSession>();

    public virtual Module Module { get; set; } = null!;

    public virtual ICollection<StudentProgress> StudentProgresses { get; set; } = new List<StudentProgress>();
}

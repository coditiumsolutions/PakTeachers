using System;
using System.Collections.Generic;

namespace PakTeachers.Api.Models;

public partial class StudentProgress
{
    public int ProgressId { get; set; }

    public int StudentId { get; set; }

    public int LessonId { get; set; }

    public DateTime? CompletedAt { get; set; }

    public int? WatchTime { get; set; }

    public string Status { get; set; } = null!;

    public virtual Lesson Lesson { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}

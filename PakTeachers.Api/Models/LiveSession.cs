using System;
using System.Collections.Generic;

namespace PakTeachers.Api.Models;

public partial class LiveSession
{
    public int SessionId { get; set; }

    public int LessonId { get; set; }

    public int TeacherId { get; set; }

    public DateTime ScheduledAt { get; set; }

    public int? DurationMinutes { get; set; }

    public string? MeetingLink { get; set; }

    public string? RecordingUrl { get; set; }

    public string Status { get; set; } = null!;

    public virtual Lesson Lesson { get; set; } = null!;

    public virtual Teacher Teacher { get; set; } = null!;
}

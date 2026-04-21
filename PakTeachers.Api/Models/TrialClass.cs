using System;
using System.Collections.Generic;

namespace PakTeachers.Api.Models;

public partial class TrialClass
{
    public int TrialId { get; set; }

    public int StudentId { get; set; }

    public int TeacherId { get; set; }

    public string Subject { get; set; } = null!;

    public DateTime ScheduledAt { get; set; }

    public string Status { get; set; } = null!;

    public string? Feedback { get; set; }

    public bool Converted { get; set; }

    public virtual Student Student { get; set; } = null!;

    public virtual Teacher Teacher { get; set; } = null!;
}

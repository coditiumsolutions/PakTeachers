using System;
using System.Collections.Generic;

namespace PakTeachers.Api.Models;

public partial class AssessmentSubmission
{
    public int SubmissionId { get; set; }

    public int AssessmentId { get; set; }

    public int StudentId { get; set; }

    public int? GradedBy { get; set; }

    public int? Score { get; set; }

    public DateTime SubmittedAt { get; set; }

    public string? Feedback { get; set; }

    public virtual Assessment Assessment { get; set; } = null!;

    public virtual Teacher? GradedByNavigation { get; set; }

    public virtual Student Student { get; set; } = null!;
}

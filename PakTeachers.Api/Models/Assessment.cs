using System;
using System.Collections.Generic;

namespace PakTeachers.Api.Models;

public partial class Assessment
{
    public int AssessmentId { get; set; }

    public int ModuleId { get; set; }

    public int CreatedBy { get; set; }

    public string AssessmentType { get; set; } = null!;

    public int TotalMarks { get; set; }

    public int Passmarks { get; set; }

    public double? Weightage { get; set; }

    public DateOnly? Date { get; set; }

    public string Status { get; set; } = null!;

    public virtual ICollection<AssessmentSubmission> AssessmentSubmissions { get; set; } = new List<AssessmentSubmission>();

    public virtual Teacher CreatedByNavigation { get; set; } = null!;

    public virtual Module Module { get; set; } = null!;
}

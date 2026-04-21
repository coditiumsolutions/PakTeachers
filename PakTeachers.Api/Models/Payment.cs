using System;
using System.Collections.Generic;

namespace PakTeachers.Api.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int StudentId { get; set; }

    public int EnrollmentId { get; set; }

    public decimal Amount { get; set; }

    public string Currency { get; set; } = null!;

    public string Method { get; set; } = null!;

    public DateTime PaidAt { get; set; }

    public string Status { get; set; } = null!;

    public virtual Enrollment Enrollment { get; set; } = null!;

    public virtual Student Student { get; set; } = null!;
}

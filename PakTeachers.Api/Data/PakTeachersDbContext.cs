using Microsoft.EntityFrameworkCore;
using PakTeachers.Api.Models;

namespace PakTeachers.Api.Data;

public partial class PakTeachersDbContext(DbContextOptions<PakTeachersDbContext> options) : DbContext(options)
{

    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<Assessment> Assessments { get; set; }

    public virtual DbSet<AssessmentSubmission> AssessmentSubmissions { get; set; }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<Enrollment> Enrollments { get; set; }

    public virtual DbSet<Lesson> Lessons { get; set; }

    public virtual DbSet<LiveSession> LiveSessions { get; set; }

    public virtual DbSet<Module> Modules { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Student> Students { get; set; }

    public virtual DbSet<StudentProgress> StudentProgresses { get; set; }

    public virtual DbSet<Teacher> Teachers { get; set; }

    public virtual DbSet<TrialClass> TrialClasses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasIndex(e => e.Email, "UQ_Admins_Email").IsUnique();

            entity.HasIndex(e => e.Username, "UQ_Admins_Username").IsUnique();

            entity.Property(e => e.AdminId).HasColumnName("admin_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(100)
                .HasColumnName("full_name");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .HasColumnName("role");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active")
                .HasColumnName("status");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        modelBuilder.Entity<Assessment>(entity =>
        {
            entity.Property(e => e.AssessmentId).HasColumnName("assessment_id");
            entity.Property(e => e.AssessmentType)
                .HasMaxLength(20)
                .HasColumnName("assessment_type");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.ModuleId).HasColumnName("module_id");
            entity.Property(e => e.Passmarks).HasColumnName("passmarks");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("draft")
                .HasColumnName("status");
            entity.Property(e => e.TotalMarks).HasColumnName("total_marks");
            entity.Property(e => e.Weightage).HasColumnName("weightage");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Assessments)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Assessments_CreatedBy");

            entity.HasOne(d => d.Module).WithMany(p => p.Assessments)
                .HasForeignKey(d => d.ModuleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Assessments_Module");
        });

        modelBuilder.Entity<AssessmentSubmission>(entity =>
        {
            entity.HasKey(e => e.SubmissionId);

            entity.HasIndex(e => new { e.StudentId, e.AssessmentId }, "UQ_AssessmentSub_StudentAssessment").IsUnique();

            entity.Property(e => e.SubmissionId).HasColumnName("submission_id");
            entity.Property(e => e.AssessmentId).HasColumnName("assessment_id");
            entity.Property(e => e.Feedback).HasColumnName("feedback");
            entity.Property(e => e.GradedBy).HasColumnName("graded_by");
            entity.Property(e => e.Score).HasColumnName("score");
            entity.Property(e => e.StudentId).HasColumnName("student_id");
            entity.Property(e => e.SubmittedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("submitted_at");

            entity.HasOne(d => d.Assessment).WithMany(p => p.AssessmentSubmissions)
                .HasForeignKey(d => d.AssessmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AssessmentSub_Assessment");

            entity.HasOne(d => d.GradedByNavigation).WithMany(p => p.AssessmentSubmissions)
                .HasForeignKey(d => d.GradedBy)
                .HasConstraintName("FK_AssessmentSub_GradedBy");

            entity.HasOne(d => d.Student).WithMany(p => p.AssessmentSubmissions)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AssessmentSub_Student");
        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.CourseType)
                .HasMaxLength(20)
                .HasColumnName("course_type");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.GradeLevel)
                .HasMaxLength(20)
                .HasColumnName("grade_level");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("draft")
                .HasColumnName("status");
            entity.Property(e => e.TeacherId).HasColumnName("teacher_id");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");

            entity.HasOne(d => d.Teacher).WithMany(p => p.Courses)
                .HasForeignKey(d => d.TeacherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Courses_Teacher");
        });

        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.HasIndex(e => new { e.StudentId, e.CourseId }, "UQ_Enrollments_StudentCourse").IsUnique();

            entity.Property(e => e.EnrollmentId).HasColumnName("enrollment_id");
            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.EnrolledDate)
                .HasDefaultValueSql("(CONVERT([date],sysdatetime()))")
                .HasColumnName("enrolled_date");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active")
                .HasColumnName("status");
            entity.Property(e => e.StudentId).HasColumnName("student_id");

            entity.HasOne(d => d.Course).WithMany(p => p.Enrollments)
                .HasForeignKey(d => d.CourseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Enrollments_Course");

            entity.HasOne(d => d.Student).WithMany(p => p.Enrollments)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Enrollments_Student");
        });

        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.Property(e => e.LessonId).HasColumnName("lesson_id");
            entity.Property(e => e.ContentType)
                .HasMaxLength(20)
                .HasColumnName("content_type");
            entity.Property(e => e.ContentUrl)
                .HasMaxLength(500)
                .HasColumnName("content_url");
            entity.Property(e => e.Date).HasColumnName("date");
            entity.Property(e => e.LearningTime).HasColumnName("learning_time");
            entity.Property(e => e.ModuleId).HasColumnName("module_id");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("draft")
                .HasColumnName("status");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");

            entity.HasOne(d => d.Module).WithMany(p => p.Lessons)
                .HasForeignKey(d => d.ModuleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Lessons_Module");
        });

        modelBuilder.Entity<LiveSession>(entity =>
        {
            entity.HasKey(e => e.SessionId);

            entity.Property(e => e.SessionId).HasColumnName("session_id");
            entity.Property(e => e.DurationMinutes).HasColumnName("duration_minutes");
            entity.Property(e => e.LessonId).HasColumnName("lesson_id");
            entity.Property(e => e.MeetingLink)
                .HasMaxLength(500)
                .HasColumnName("meeting_link");
            entity.Property(e => e.RecordingUrl)
                .HasMaxLength(500)
                .HasColumnName("recording_url");
            entity.Property(e => e.ScheduledAt).HasColumnName("scheduled_at");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("scheduled")
                .HasColumnName("status");
            entity.Property(e => e.TeacherId).HasColumnName("teacher_id");

            entity.HasOne(d => d.Lesson).WithMany(p => p.LiveSessions)
                .HasForeignKey(d => d.LessonId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LiveSessions_Lesson");

            entity.HasOne(d => d.Teacher).WithMany(p => p.LiveSessions)
                .HasForeignKey(d => d.TeacherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LiveSessions_Teacher");
        });

        modelBuilder.Entity<Module>(entity =>
        {
            entity.Property(e => e.ModuleId).HasColumnName("module_id");
            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.LearningObjectives).HasColumnName("learning_objectives");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("draft")
                .HasColumnName("status");
            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .HasColumnName("title");

            entity.HasOne(d => d.Course).WithMany(p => p.Modules)
                .HasForeignKey(d => d.CourseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Modules_Course");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.Property(e => e.PaymentId).HasColumnName("payment_id");
            entity.Property(e => e.Amount)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("amount");
            entity.Property(e => e.Currency)
                .HasMaxLength(10)
                .HasDefaultValue("PKR")
                .HasColumnName("currency");
            entity.Property(e => e.EnrollmentId).HasColumnName("enrollment_id");
            entity.Property(e => e.Method)
                .HasMaxLength(20)
                .HasColumnName("method");
            entity.Property(e => e.PaidAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("paid_at");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("pending")
                .HasColumnName("status");
            entity.Property(e => e.StudentId).HasColumnName("student_id");

            entity.HasOne(d => d.Enrollment).WithMany(p => p.Payments)
                .HasForeignKey(d => d.EnrollmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Payments_Enrollment");

            entity.HasOne(d => d.Student).WithMany(p => p.Payments)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Payments_Student");
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasIndex(e => e.Username, "UQ_Students_Username").IsUnique();

            entity.Property(e => e.StudentId).HasColumnName("student_id");
            entity.Property(e => e.City)
                .HasMaxLength(100)
                .HasColumnName("city");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .HasColumnName("email");
            entity.Property(e => e.EnrolledDate)
                .HasDefaultValueSql("(CONVERT([date],sysdatetime()))")
                .HasColumnName("enrolled_date");
            entity.Property(e => e.FullName)
                .HasMaxLength(100)
                .HasColumnName("full_name");
            entity.Property(e => e.GradeLevel)
                .HasMaxLength(20)
                .HasColumnName("grade_level");
            entity.Property(e => e.GuardianName)
                .HasMaxLength(100)
                .HasColumnName("guardian_name");
            entity.Property(e => e.GuardianPhone)
                .HasMaxLength(20)
                .HasColumnName("guardian_phone");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .HasColumnName("phone");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active")
                .HasColumnName("status");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Students)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Students_CreatedBy");
        });

        modelBuilder.Entity<StudentProgress>(entity =>
        {
            entity.HasKey(e => e.ProgressId);

            entity.ToTable("StudentProgress");

            entity.HasIndex(e => new { e.StudentId, e.LessonId }, "UQ_StudentProgress_StudentLesson").IsUnique();

            entity.Property(e => e.ProgressId).HasColumnName("progress_id");
            entity.Property(e => e.CompletedAt).HasColumnName("completed_at");
            entity.Property(e => e.LessonId).HasColumnName("lesson_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("not_started")
                .HasColumnName("status");
            entity.Property(e => e.StudentId).HasColumnName("student_id");
            entity.Property(e => e.WatchTime).HasColumnName("watch_time");

            entity.HasOne(d => d.Lesson).WithMany(p => p.StudentProgresses)
                .HasForeignKey(d => d.LessonId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentProgress_Lesson");

            entity.HasOne(d => d.Student).WithMany(p => p.StudentProgresses)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StudentProgress_Student");
        });

        modelBuilder.Entity<Teacher>(entity =>
        {
            entity.HasIndex(e => e.Cnic, "UQ_Teachers_CNIC").IsUnique();

            entity.HasIndex(e => e.Email, "UQ_Teachers_Email").IsUnique();

            entity.HasIndex(e => e.Username, "UQ_Teachers_Username").IsUnique();

            entity.Property(e => e.TeacherId).HasColumnName("teacher_id");
            entity.Property(e => e.Cnic)
                .HasMaxLength(15)
                .HasColumnName("cnic");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(100)
                .HasColumnName("full_name");
            entity.Property(e => e.JoinedDate)
                .HasDefaultValueSql("(CONVERT([date],sysdatetime()))")
                .HasColumnName("joined_date");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .HasColumnName("phone");
            entity.Property(e => e.Qualification)
                .HasMaxLength(150)
                .HasColumnName("qualification");
            entity.Property(e => e.Specialization)
                .HasMaxLength(150)
                .HasColumnName("specialization");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("active")
                .HasColumnName("status");
            entity.Property(e => e.TeacherType)
                .HasMaxLength(20)
                .HasColumnName("teacher_type");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Teachers)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Teachers_CreatedBy");
        });

        modelBuilder.Entity<TrialClass>(entity =>
        {
            entity.HasKey(e => e.TrialId);

            entity.Property(e => e.TrialId).HasColumnName("trial_id");
            entity.Property(e => e.Converted).HasColumnName("converted");
            entity.Property(e => e.Feedback).HasColumnName("feedback");
            entity.Property(e => e.ScheduledAt).HasColumnName("scheduled_at");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("pending")
                .HasColumnName("status");
            entity.Property(e => e.StudentId).HasColumnName("student_id");
            entity.Property(e => e.Subject)
                .HasMaxLength(100)
                .HasColumnName("subject");
            entity.Property(e => e.TeacherId).HasColumnName("teacher_id");

            entity.HasOne(d => d.Student).WithMany(p => p.TrialClasses)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TrialClasses_Student");

            entity.HasOne(d => d.Teacher).WithMany(p => p.TrialClasses)
                .HasForeignKey(d => d.TeacherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TrialClasses_Teacher");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

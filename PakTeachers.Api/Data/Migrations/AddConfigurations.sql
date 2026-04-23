-- ============================================================
-- Migration: AddConfigurations
-- Creates the Configurations vocabulary table, seeds initial
-- values, and adds the fn_IsValidConfigValue scalar function.
-- ============================================================

-- ── TABLE ────────────────────────────────────────────────────

CREATE TABLE [dbo].[Configurations] (
    [config_id]    INT           NOT NULL IDENTITY(1,1),
    [config_key]   NVARCHAR(50)  NOT NULL,
    [config_value] NVARCHAR(100) NOT NULL,
    [label]        NVARCHAR(150) NOT NULL,
    [is_active]    BIT           NOT NULL CONSTRAINT DF_Configurations_IsActive    DEFAULT (1),
    [sort_order]   INT           NOT NULL CONSTRAINT DF_Configurations_SortOrder   DEFAULT (0),
    CONSTRAINT PK_Configurations         PRIMARY KEY ([config_id]),
    CONSTRAINT UQ_Configurations_KeyValue UNIQUE ([config_key], [config_value])
);
GO

-- ── SEED DATA ─────────────────────────────────────────────────

-- city
INSERT INTO [dbo].[Configurations] ([config_key],[config_value],[label],[sort_order]) VALUES
('city', 'islamabad',   'Islamabad',   10),
('city', 'rawalpindi',  'Rawalpindi',  20),
('city', 'lahore',      'Lahore',      30),
('city', 'karachi',     'Karachi',     40),
('city', 'peshawar',    'Peshawar',    50),
('city', 'quetta',      'Quetta',      60),
('city', 'faisalabad',  'Faisalabad',  70),
('city', 'multan',      'Multan',      80),
('city', 'other',       'Other',       90);

-- grade_level
INSERT INTO [dbo].[Configurations] ([config_key],[config_value],[label],[sort_order]) VALUES
('grade_level', 'grade_1',  'Grade 1',  10),
('grade_level', 'grade_2',  'Grade 2',  20),
('grade_level', 'grade_3',  'Grade 3',  30),
('grade_level', 'grade_4',  'Grade 4',  40),
('grade_level', 'grade_5',  'Grade 5',  50),
('grade_level', 'grade_6',  'Grade 6',  60),
('grade_level', 'grade_7',  'Grade 7',  70),
('grade_level', 'grade_8',  'Grade 8',  80),
('grade_level', 'grade_9',  'Grade 9',  90),
('grade_level', 'grade_10', 'Grade 10', 100),
('grade_level', 'o_levels', 'O-Levels', 110),
('grade_level', 'a_levels', 'A-Levels', 120);

-- payment_method
INSERT INTO [dbo].[Configurations] ([config_key],[config_value],[label],[sort_order]) VALUES
('payment_method', 'cash',          'Cash',           10),
('payment_method', 'bank_transfer', 'Bank Transfer',  20),
('payment_method', 'easypaisa',     'EasyPaisa',      30),
('payment_method', 'jazzcash',      'JazzCash',       40),
('payment_method', 'cheque',        'Cheque',         50);

-- payment_status
INSERT INTO [dbo].[Configurations] ([config_key],[config_value],[label],[sort_order]) VALUES
('payment_status', 'pending',   'Pending',   10),
('payment_status', 'completed', 'Completed', 20),
('payment_status', 'failed',    'Failed',    30),
('payment_status', 'refunded',  'Refunded',  40);

-- enrollment_status
INSERT INTO [dbo].[Configurations] ([config_key],[config_value],[label],[sort_order]) VALUES
('enrollment_status', 'active',    'Active',    10),
('enrollment_status', 'dropped',   'Dropped',   20),
('enrollment_status', 'completed', 'Completed', 30);

-- assessment_type
INSERT INTO [dbo].[Configurations] ([config_key],[config_value],[label],[sort_order]) VALUES
('assessment_type', 'quiz',       'Quiz',        10),
('assessment_type', 'assignment', 'Assignment',  20),
('assessment_type', 'midterm',    'Midterm',     30),
('assessment_type', 'final',      'Final Exam',  40),
('assessment_type', 'project',    'Project',     50);

-- assessment_status
INSERT INTO [dbo].[Configurations] ([config_key],[config_value],[label],[sort_order]) VALUES
('assessment_status', 'draft',  'Draft',  10),
('assessment_status', 'active', 'Active', 20),
('assessment_status', 'closed', 'Closed', 30);

-- lesson_status
INSERT INTO [dbo].[Configurations] ([config_key],[config_value],[label],[sort_order]) VALUES
('lesson_status', 'not_started', 'Not Started', 10),
('lesson_status', 'in_progress', 'In Progress', 20),
('lesson_status', 'completed',   'Completed',   30);

GO

-- ── SCALAR FUNCTION ───────────────────────────────────────────

CREATE FUNCTION [dbo].[fn_IsValidConfigValue]
(
    @key   NVARCHAR(50),
    @value NVARCHAR(100)
)
RETURNS BIT
AS
BEGIN
    DECLARE @result BIT = 0;
    IF EXISTS (
        SELECT 1
        FROM   [dbo].[Configurations]
        WHERE  [config_key]   = @key
          AND  [config_value] = @value
          AND  [is_active]    = 1
    )
        SET @result = 1;
    RETURN @result;
END;
GO

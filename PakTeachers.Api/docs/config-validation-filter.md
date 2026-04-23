# Config Validation Filter

Automatic DTO validation against database-backed configuration values, enforced as a global action filter.

---

## Problem It Solves

Before this feature, every service method that accepted a DTO with a config-constrained field (e.g. `GradeLevel`, `CourseType`, `PaymentMethod`) had to manually call `IConfigurationService.IsValid()` and return an error response. This pattern was repeated across five services, produced one error at a time, and was easy to forget when adding new DTOs.

**Example of what the old code looked like:**

```csharp
// StudentService.cs — CreateStudentAsync
if (dto.City is not null && !config.IsValid("city", dto.City))
    return new ApiResponse<StudentResponseDTO>(config.InvalidMessage("city", dto.City));

if (!config.IsValid("grade_level", dto.GradeLevel))
    return new ApiResponse<StudentResponseDTO>(config.InvalidMessage("grade_level", dto.GradeLevel));
```

Each service independently owned the validation logic, and errors were returned one at a time — the caller never saw all problems at once.

---

## How It Works

### 1. The Attribute — `[ConfigValidation]`

**File:** `Attributes/ConfigValidationAttribute.cs`

```csharp
[ConfigValidation("grade_level")]          // required — must be non-null and a valid config value
[ConfigValidation("city", AllowNull = true)] // optional — null is accepted; non-null values are validated
```

Placed on any DTO property that must match an active value in the `Configurations` table.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `configKey` | `string` | *(required)* | The configuration key to validate against (e.g. `"grade_level"`, `"payment_method"`) |
| `AllowNull` | `bool` | `false` | If `true`, a null or empty value skips validation instead of failing |

### 2. The Filter — `ConfigValidationFilter`

**File:** `Filters/ConfigValidationFilter.cs`

Implements `IAsyncActionFilter`. On every controller action invocation, before the action body runs, it:

1. Iterates all action arguments (i.e. bound DTOs from `[FromBody]`, `[FromQuery]`, etc.)
2. Reflects over each argument's properties looking for `[ConfigValidation]` attributes
3. For each decorated property, reads the value and calls `IConfigurationService.IsValid(configKey, value)` — which hits the **in-memory cache only**, adding zero database latency
4. Collects all failures into a `Dictionary<string, string>` (property name → error message)
5. If any errors exist, short-circuits with `422 Unprocessable Entity` before the action runs

**Error response shape:**

```json
{
  "success": false,
  "message": "Validation failed",
  "source": "ConfigValidationFilter",
  "errors": {
    "GradeLevel": "Invalid value 'grade13' for configuration key 'grade_level'.",
    "City": "Invalid value 'atlantis' for configuration key 'city'."
  }
}
```

All errors are returned in a single response — the caller sees every problem at once.

### 3. Global Registration — `Program.cs`

The filter runs on every controller action automatically. No per-controller or per-action opt-in is needed.

```csharp
builder.Services.AddScoped<ConfigValidationFilter>();
builder.Services.AddControllers(options =>
    options.Filters.AddService<ConfigValidationFilter>());
```

---

## What Changed

### New Files

| File | Description |
|------|-------------|
| `Attributes/ConfigValidationAttribute.cs` | Custom attribute marking DTO properties for config validation |
| `Filters/ConfigValidationFilter.cs` | Global action filter that enforces the attribute |

### Modified DTOs

Each of the following DTOs had `[ConfigValidation]` added to the relevant property. `AllowNull = true` is set on nullable/optional properties.

| DTO File | Property | Config Key | AllowNull |
|----------|----------|------------|-----------|
| `DTOs/StudentCreateDTO.cs` | `GradeLevel` | `grade_level` | No |
| `DTOs/StudentCreateDTO.cs` | `City` | `city` | Yes |
| `DTOs/StudentUpdateDTO.cs` | `GradeLevel` | `grade_level` | Yes |
| `DTOs/StudentUpdateDTO.cs` | `City` | `city` | Yes |
| `DTOs/TeacherCreateDTO.cs` | `TeacherType` | `teacher_type` | No |
| `DTOs/CourseDTO.cs` | `CourseCreateDto.CourseType` | `course_type` | No |
| `DTOs/CourseDTO.cs` | `CourseCreateDto.GradeLevel` | `grade_level` | Yes |
| `DTOs/CourseDTO.cs` | `CourseUpdateDto.CourseType` | `course_type` | Yes |
| `DTOs/CourseDTO.cs` | `CourseUpdateDto.GradeLevel` | `grade_level` | Yes |
| `DTOs/AssessmentDTO.cs` | `AssessmentCreateDto.AssessmentType` | `assessment_type` | No |
| `DTOs/AssessmentDTO.cs` | `AssessmentUpdateDto.AssessmentType` | `assessment_type` | Yes |
| `DTOs/AssessmentDTO.cs` | `AssessmentStatusUpdateDto.Status` | `assessment_status` | No |
| `DTOs/PaymentDTO.cs` | `PaymentCreateDto.Method` | `payment_method` | No |
| `DTOs/PaymentDTO.cs` | `PaymentStatusPatchDto.Status` | `payment_status` | No |
| `DTOs/EnrollmentDTO.cs` | `EnrollmentCreateDto.Method` | `payment_method` | No |
| `DTOs/EnrollmentDTO.cs` | `EnrollmentStatusUpdateDto.Status` | `enrollment_status` | No |

### Modified Program.cs

- Added `using PakTeachers.Api.Filters;`
- Registered `ConfigValidationFilter` as a scoped service
- Changed `AddControllers()` to `AddControllers(options => options.Filters.AddService<ConfigValidationFilter>())`

---

## What Was Removed

### Deleted from Services

The following manual `IsValid()` calls were removed. The filter now handles these checks before the service is ever reached.

#### `Services/StudentService.cs`
- Removed: `config.IsValid("city", dto.City)` check in `CreateStudentAsync`
- Removed: `config.IsValid("grade_level", dto.GradeLevel)` check in `CreateStudentAsync`
- Removed: `config.IsValid("city", dto.City)` check in `UpdateStudentAsync`
- Removed: `config.IsValid("grade_level", dto.GradeLevel)` check in `UpdateStudentAsync`
- Removed: `IConfigurationService config` from constructor — dependency no longer needed

#### `Services/AssessmentService.cs`
- Removed: `config.IsValid("assessment_type", dto.AssessmentType)` check in `CreateAssessmentAsync`
- Removed: `config.IsValid("assessment_type", dto.AssessmentType)` check in `UpdateAssessmentAsync`
- Removed: `config.IsValid("assessment_status", newStatus)` check in `UpdateAssessmentStatusAsync`
- Removed: `IConfigurationService config` from constructor — dependency no longer needed

#### `Services/EnrollmentService.cs`
- Removed: `config.IsValid("payment_method", dto.Method)` check in `CreateEnrollmentAsync`
- Removed: `config.IsValid("enrollment_status", newStatus)` check in `UpdateEnrollmentStatusAsync`
- Removed: `IConfigurationService config` from constructor — dependency no longer needed

#### `Services/PaymentService.cs`
- Removed: `config.IsValid("payment_method", dto.Method)` check in `CreatePaymentAsync`
- Removed: `config.IsValid("payment_status", next)` check in `PatchPaymentStatusAsync`
- Removed: `IConfigurationService config` from constructor — dependency no longer needed

#### `Services/CourseService.cs`
- Removed: `ValidTypes` static `HashSet<string>` (`{ "academic", "quran" }`) — hardcoded vocabulary list replaced by config
- Removed: `ValidTypes.Contains(dto.CourseType)` check in `CreateCourseAsync`
- Removed: `ValidTypes.Contains(dto.CourseType)` check in `UpdateCourseAsync`
- Note: `CourseService` never injected `IConfigurationService`; it used a hardcoded set instead. That set is now gone.

---

## What Was NOT Removed

Manual `IsValid()` calls that guard **status transition logic** (not just vocabulary) were kept in services. The filter validates that the value is a known config value; the service then enforces which transitions are permitted.

| Service | Check Kept | Reason |
|---------|-----------|--------|
| *(none)* | — | All remaining transition logic uses independent `switch`/`if` checks on state pairs, not `IsValid()` |

All transition guards (`enrollment.Status != "active"`, the assessment `switch ((current, newStatus))` block, `IsValidTransition()` in PaymentService) are pure business logic and were untouched.

---

## Performance Note

`IConfigurationService.IsValid()` reads exclusively from `IMemoryCache` — it never queries the database. The filter adds no I/O overhead per request. The cache is populated at startup via `RefreshCacheAsync()` and is refreshed after every write to the `Configurations` table.

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PakTeachers.Api.DTOs;
using PakTeachers.Api.Services;

namespace PakTeachers.Api.Controllers;

[ApiController]
[Authorize]
public class PaymentsController(IPaymentService paymentService) : ControllerBase
{
    private int CallerId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

    private string? CallerRole =>
        User.FindFirstValue(ClaimTypes.Role);

    // ── GET /api/payments/summary (SuperAdmin only) ───────────────────────────
    // Registered BEFORE /api/payments/{id} to prevent route shadowing

    [Authorize(Roles = "super_admin")]
    [HttpGet("api/payments/summary")]
    public async Task<IActionResult> GetPaymentSummary()
    {
        var result = await paymentService.GetPaymentSummaryAsync();
        return Ok(result);
    }

    // ── GET /api/payments (Admin/Support only) ────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support")]
    [HttpGet("api/payments")]
    public async Task<IActionResult> GetPayments(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null,
        [FromQuery] string? method = null,
        [FromQuery] int? studentId = null,
        [FromQuery] int? enrollmentId = null,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null)
    {
        var result = await paymentService.GetPaymentsAsync(
            page, pageSize, status, method, studentId, enrollmentId, from, to);
        return Ok(result);
    }

    // ── GET /api/payments/{id} (Admin/Support only) ───────────────────────────

    [Authorize(Roles = "super_admin,admin,support")]
    [HttpGet("api/payments/{id:int}")]
    public async Task<IActionResult> GetPaymentById(int id)
    {
        var result = await paymentService.GetPaymentByIdAsync(id);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── GET /api/students/{studentId}/payments (Student self or Admin) ─────────

    [HttpGet("api/students/{studentId:int}/payments")]
    public async Task<IActionResult> GetPaymentsByStudent(
        int studentId,
        [FromQuery] string? status = null)
    {
        var result = await paymentService.GetPaymentsByStudentAsync(
            studentId, status, CallerRole, CallerId);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message == "Access denied.") return Forbid();
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── POST /api/payments (Admin/Support only) ───────────────────────────────

    [Authorize(Roles = "super_admin,admin,support")]
    [HttpPost("api/payments")]
    public async Task<IActionResult> CreatePayment([FromBody] PaymentCreateDto dto)
    {
        var result = await paymentService.CreatePaymentAsync(dto);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message == "duplicate_payment") return Conflict(result);
            if (result.Message?.Contains("Amount must be") == true ||
                result.Message?.Contains("does not belong") == true) return UnprocessableEntity(result);
            return BadRequest(result);
        }
        return Ok(result);
    }

    // ── PATCH /api/payments/{id}/status ──────────────────────────────────────

    [Authorize(Roles = "super_admin,admin,support")]
    [HttpPatch("api/payments/{id:int}/status")]
    public async Task<IActionResult> PatchPaymentStatus(int id, [FromBody] PaymentStatusPatchDto dto)
    {
        var result = await paymentService.PatchPaymentStatusAsync(id, dto, CallerRole);
        if (!result.Success)
        {
            if (result.Message?.Contains("not found") == true) return NotFound(result);
            if (result.Message?.Contains("not allowed") == true ||
                result.Message?.Contains("Only super_admin") == true) return UnprocessableEntity(result);
            return BadRequest(result);
        }
        return Ok(result);
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Text;
using System.Text.Json;

using MediConnect.API.DTOs;
using MediConnect.Domain.Entities;
using MediConnect.Infrastructure.Persistence;
using MediConnect.Domain.Enums;

namespace MediConnect.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public AppointmentsController(AppDbContext context, IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAppointment(
        CreateAppointmentDto dto)
    {
        // Since DoctorProfiles table was moved to a microservice, 
        // we skip the local validation for now or would call the service.

        var patient = await _context.Users
            .FindAsync(dto.PatientId);

        if (patient == null)
        {
            return BadRequest("Patient not found");
        }

        var appointment = new Appointment
        {
            AppointmentDate = dto.AppointmentDate,
            Reason = dto.Reason,
            DoctorId = dto.DoctorId,
            PatientId = dto.PatientId
        };

        await _context.Appointments.AddAsync(appointment);

        await _context.SaveChangesAsync();

        return Ok(appointment);
    }

    [HttpGet]
    public async Task<IActionResult> GetAppointments()
    {
        var appointments = await _context.Appointments
            .Include(a => a.Patient)
            .ToListAsync();

        return Ok(appointments);
    }

    [HttpGet("doctor/{doctorId}")]
public async Task<IActionResult> GetDoctorAppointments(Guid doctorId)
{
    var appointments = await _context.Appointments
        .Where(a => a.DoctorId == doctorId)
        .ToListAsync();

    return Ok(appointments);
}

[HttpGet("patient/{patientId}")]
public async Task<IActionResult> GetPatientAppointments(Guid patientId)
{
    var appointments = await _context.Appointments
        .Where(a => a.PatientId == patientId)
        .ToListAsync();

    return Ok(appointments);
}

[HttpPut("{id}/cancel")]
public async Task<IActionResult> CancelAppointment(Guid id)
{
    var appointment = await _context.Appointments.FindAsync(id);

    if (appointment == null)
    {
        return NotFound("Appointment not found");
    }

    appointment.Status = AppointmentStatus.Cancelled;

    await _context.SaveChangesAsync();

    return Ok(appointment);
}

[HttpPut("{id}/confirm")]
public async Task<IActionResult> ConfirmAppointment(Guid id)
{
    var appointment = await _context.Appointments.FindAsync(id);

    if (appointment == null)
    {
        return NotFound("Appointment not found");
    }

    appointment.Status = AppointmentStatus.Confirmed;

    await _context.SaveChangesAsync();

    // Create conversation in messaging service
    try
    {
        var messagingServiceUrl = _configuration["MessagingService:Url"] ?? "http://localhost:5197/api";
        var client = _httpClientFactory.CreateClient();

        var authHeader = Request.Headers.Authorization.ToString();
        if (!string.IsNullOrEmpty(authHeader))
        {
            client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", authHeader);
        }

        var initiateDto = new
        {
            patientId = appointment.PatientId,
            doctorId = appointment.DoctorId
        };

        var content = new StringContent(
            JsonSerializer.Serialize(initiateDto),
            Encoding.UTF8,
            "application/json"
        );

        var response = await client.PostAsync($"{messagingServiceUrl}/Conversations/initiate", content);
        
        if (!response.IsSuccessStatusCode)
        {
            // Log the error but don't fail the appointment confirmation
            Console.WriteLine($"Failed to create conversation: {response.StatusCode}");
        }
    }
    catch (Exception ex)
    {
        // Log the error but don't fail the appointment confirmation
        Console.WriteLine($"Error creating conversation: {ex.Message}");
    }

    return Ok(appointment);
}

}
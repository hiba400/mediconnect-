using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;



using AppointmentService.API.DTOs;
using AppointmentService.API.Data;
using AppointmentService.API.Entities;
using AppointmentService.API.Enums;

namespace AppointmentService.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AppointmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAppointment(
        CreateAppointmentDto dto)
    {
        // Since DoctorProfiles table was moved to a microservice, 
        // we skip the local validation for now or would call the service.

    
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

    return Ok(appointment);
}

}
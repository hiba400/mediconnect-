using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

    public AppointmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAppointment(
        CreateAppointmentDto dto)
    {
        var doctor = await _context.DoctorProfiles
            .FindAsync(dto.DoctorId);

        if (doctor == null)
        {
            return BadRequest("Doctor not found");
        }

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
            .Include(a => a.Doctor)
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
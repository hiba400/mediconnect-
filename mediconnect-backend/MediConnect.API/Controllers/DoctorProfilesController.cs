using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MediConnect.API.DTOs;
using MediConnect.Domain.Entities;
using MediConnect.Infrastructure.Persistence;

namespace MediConnect.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DoctorProfilesController : ControllerBase
{
    private readonly AppDbContext _context;

    public DoctorProfilesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateDoctorProfile(CreateDoctorProfileDto dto)
    {
        var doctorProfile = new DoctorProfile
        {
            UserId = dto.UserId,
            Specialty = dto.Specialty,
            Bio = dto.Bio,
            ConsultationFee = dto.ConsultationFee,
            YearsOfExperience = dto.YearsOfExperience,
            City = dto.City
        };

        await _context.DoctorProfiles.AddAsync(doctorProfile);

        await _context.SaveChangesAsync();

        return Ok(doctorProfile);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllDoctors()
    {
        var doctors = await _context.DoctorProfiles
            .Include(d => d.User)
            .ToListAsync();

        return Ok(doctors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDoctorById(Guid id)
    {
        var doctor = await _context.DoctorProfiles
            .Include(d => d.User)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (doctor == null)
        {
            return NotFound("Doctor not found");
        }

        return Ok(doctor);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDoctorProfile(Guid id, UpdateDoctorProfileDto dto)
    {
        var doctor = await _context.DoctorProfiles.FindAsync(id);

        if (doctor == null)
        {
            return NotFound("Doctor not found");
        }

        doctor.Specialty = dto.Specialty;
        doctor.Bio = dto.Bio;
        doctor.ConsultationFee = dto.ConsultationFee;
        doctor.YearsOfExperience = dto.YearsOfExperience;
        doctor.City = dto.City;

        await _context.SaveChangesAsync();

        return Ok(doctor);
    }
}
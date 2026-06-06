using MediConnect.API.DTOs;
using MediConnect.Domain.Entities;
using MediConnect.Domain.Enums;
using MediConnect.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediConnect.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DoctorApplicationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public DoctorApplicationsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Submit(CreateDoctorApplicationDto dto)
    {
        var existing = await _context.DoctorApplications
            .FirstOrDefaultAsync(a => a.UserId == dto.UserId || a.Email == dto.Email);

        if (existing != null)
        {
            return Ok(existing);
        }

        var application = new DoctorApplication
        {
            Id = Guid.NewGuid(),
            UserId = dto.UserId,
            FullName = dto.FullName,
            Email = dto.Email,
            Specialty = dto.Specialty,
            LicenseNumber = dto.LicenseNumber,
            City = dto.City,
            YearsOfExperience = dto.YearsOfExperience,
            Bio = dto.Bio,
            DocumentCount = dto.DocumentCount,
            Status = ApplicationStatus.Pending,
            SubmittedAt = DateTime.UtcNow
        };

        await _context.DoctorApplications.AddAsync(application);
        await _context.SaveChangesAsync();
        return Ok(application);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll([FromQuery] string? status = null)
    {
        var query = _context.DoctorApplications.AsQueryable();

        if (status != null && Enum.TryParse<ApplicationStatus>(status, true, out var parsed))
        {
            query = query.Where(a => a.Status == parsed);
        }

        var apps = await query.OrderByDescending(a => a.SubmittedAt).ToListAsync();
        return Ok(apps);
    }

    [HttpPut("{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Approve(Guid id)
    {
        var app = await _context.DoctorApplications.FindAsync(id);
        if (app == null) return NotFound("Application not found");

        app.Status = ApplicationStatus.Approved;
        await _context.SaveChangesAsync();
        return Ok(app);
    }

    [HttpPut("{id}/reject")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Reject(Guid id)
    {
        var app = await _context.DoctorApplications.FindAsync(id);
        if (app == null) return NotFound("Application not found");

        app.Status = ApplicationStatus.Rejected;
        await _context.SaveChangesAsync();
        return Ok(app);
    }
}

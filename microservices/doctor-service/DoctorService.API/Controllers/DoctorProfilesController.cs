using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DoctorService.Application.DTOs;
using DoctorService.Application.Interfaces;
using DoctorService.Domain.Entities;

namespace DoctorService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DoctorProfilesController : ControllerBase
{
    private readonly IDoctorService _doctorService;

    public DoctorProfilesController(IDoctorService doctorService)
    {
        _doctorService = doctorService;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateDoctorProfile(CreateDoctorProfileDto dto)
    {
        var doctor = await _doctorService.CreateDoctorAsync(dto);
        return Ok(doctor);
    }

    [HttpPost("me")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> CreateMyProfile(CreateDoctorProfileDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        dto.UserId = userId;
        if (string.IsNullOrWhiteSpace(dto.FullName))
        {
            dto.FullName = User.FindFirstValue(ClaimTypes.Email) ?? "Doctor";
        }

        var existing = await _doctorService.GetDoctorByUserIdAsync(userId);
        if (existing != null)
        {
            return Ok(existing);
        }

        var doctor = await _doctorService.CreateDoctorAsync(dto);
        return Ok(doctor);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetDoctorByUserId(Guid userId)
    {
        var doctor = await _doctorService.GetDoctorByUserIdAsync(userId);
        if (doctor == null) return NotFound("Doctor not found");
        return Ok(doctor);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllDoctors([FromQuery] string? specialty = null, [FromQuery] string? city = null)
    {
        var doctors = await _doctorService.GetAllDoctorsAsync(specialty, city);
        return Ok(doctors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDoctorById(Guid id)
    {
        var doctor = await _doctorService.GetDoctorByIdAsync(id);

        if (doctor == null)
        {
            return NotFound("Doctor not found");
        }

        return Ok(doctor);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDoctorProfile(Guid id, UpdateDoctorProfileDto dto)
    {
        try
        {
            await _doctorService.UpdateDoctorAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Doctor not found");
        }
    }
}

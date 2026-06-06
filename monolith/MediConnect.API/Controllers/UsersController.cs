using Microsoft.AspNetCore.Mvc;
using MediConnect.Domain.Entities;
using MediConnect.Domain.Enums;
using MediConnect.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using MediConnect.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace MediConnect.API.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

  [HttpPost]
  [AllowAnonymous]
public async Task<IActionResult> CreateUser(CreateUserDto dto)
{
    var user = new ApplicationUser
    {
        FullName = dto.FullName,
        Email = dto.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        Role = dto.Role,
        IsActive = true
    };

    await _context.Users.AddAsync(user);

    await _context.SaveChangesAsync();

    return Ok(user);
}
    
    [HttpGet]
    [Authorize(Roles = "Admin")]
public async Task<IActionResult> GetAllUsers()
{
    var users = await _context.Users.ToListAsync();

    return Ok(users);
}

[HttpGet("doctors")]
public async Task<IActionResult> GetDoctors()
{
    var doctors = await _context.Users
        .Where(u => u.Role == UserRole.Doctor && u.IsActive)
        .Select(u => new { u.Id, u.FullName, u.Email })
        .ToListAsync();

    return Ok(doctors);
}

[HttpGet("{id}")]
public async Task<IActionResult> GetUserById(Guid id)
{
    var user = await _context.Users.FindAsync(id);

    if (user == null)
    {
        return NotFound("User not found");
    }

    return Ok(user);
}

[HttpDelete("{id}")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> DeleteUser(Guid id)
{
    var user = await _context.Users.FindAsync(id);

    if (user == null)
    {
        return NotFound("User not found");
    }

    _context.Users.Remove(user);

    await _context.SaveChangesAsync();

    return Ok("User deleted");
}

[HttpPut("{id}")]
public async Task<IActionResult> UpdateUser(Guid id, UpdateUserDto dto)
{
    var user = await _context.Users.FindAsync(id);

    if (user == null)
    {
        return NotFound("User not found");
    }

    user.FullName = dto.FullName;
    user.Email = dto.Email;
    if (dto.IsActive.HasValue)
    {
        user.IsActive = dto.IsActive.Value;
    }

    await _context.SaveChangesAsync();

    return Ok(user);
}
}
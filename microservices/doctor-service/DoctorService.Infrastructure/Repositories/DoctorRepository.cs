using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DoctorService.Domain.Entities;
using DoctorService.Domain.Interfaces;
using DoctorService.Infrastructure.Data;

namespace DoctorService.Infrastructure.Repositories;

public class DoctorRepository : IDoctorRepository
{
    private readonly DoctorDbContext _context;

    public DoctorRepository(DoctorDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DoctorProfile>> GetAllAsync(string? specialty = null, string? city = null)
    {
        var query = _context.DoctorProfiles.AsQueryable();

        if (!string.IsNullOrEmpty(specialty))
        {
            query = query.Where(d => d.Specialty == specialty);
        }

        if (!string.IsNullOrEmpty(city))
        {
            query = query.Where(d => d.City == city);
        }

        return await query.ToListAsync();
    }

    public async Task<DoctorProfile?> GetByIdAsync(Guid id)
    {
        return await _context.DoctorProfiles.FindAsync(id);
    }

    public async Task<DoctorProfile?> GetByUserIdAsync(Guid userId)
    {
        return await _context.DoctorProfiles.FirstOrDefaultAsync(d => d.UserId == userId);
    }

    public async Task AddAsync(DoctorProfile doctorProfile)
    {
        await _context.DoctorProfiles.AddAsync(doctorProfile);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(DoctorProfile doctorProfile)
    {
        _context.DoctorProfiles.Update(doctorProfile);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(DoctorProfile doctorProfile)
    {
        _context.DoctorProfiles.Remove(doctorProfile);
        await _context.SaveChangesAsync();
    }
}

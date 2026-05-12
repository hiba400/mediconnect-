using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DoctorService.Domain.Entities;

namespace DoctorService.Domain.Interfaces;

public interface IDoctorRepository
{
    Task<IEnumerable<DoctorProfile>> GetAllAsync(string? specialty = null, string? city = null);
    Task<DoctorProfile?> GetByIdAsync(Guid id);
    Task<DoctorProfile?> GetByUserIdAsync(Guid userId);
    Task AddAsync(DoctorProfile doctorProfile);
    Task UpdateAsync(DoctorProfile doctorProfile);
    Task DeleteAsync(DoctorProfile doctorProfile);
}

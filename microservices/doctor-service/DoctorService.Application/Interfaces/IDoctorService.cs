using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DoctorService.Application.DTOs;

namespace DoctorService.Application.Interfaces;

public interface IDoctorService
{
    Task<IEnumerable<DoctorDto>> GetAllDoctorsAsync(string? specialty = null, string? city = null);
    Task<DoctorDto?> GetDoctorByIdAsync(Guid id);
    Task<DoctorDto?> GetDoctorByUserIdAsync(Guid userId);
    Task<DoctorDto> CreateDoctorAsync(CreateDoctorProfileDto dto);
    Task UpdateDoctorAsync(Guid id, UpdateDoctorProfileDto dto);
}

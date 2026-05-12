using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DoctorService.Application.DTOs;
using DoctorService.Application.Interfaces;
using DoctorService.Domain.Entities;
using DoctorService.Domain.Interfaces;

namespace DoctorService.Application.Services;

public class DoctorService : IDoctorService
{
    private readonly IDoctorRepository _repository;

    public DoctorService(IDoctorRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<DoctorDto>> GetAllDoctorsAsync(string? specialty = null, string? city = null)
    {
        var doctors = await _repository.GetAllAsync(specialty, city);
        return doctors.Select(d => MapToDto(d));
    }

    public async Task<DoctorDto?> GetDoctorByIdAsync(Guid id)
    {
        var doctor = await _repository.GetByIdAsync(id);
        return doctor != null ? MapToDto(doctor) : null;
    }

    public async Task<DoctorDto?> GetDoctorByUserIdAsync(Guid userId)
    {
        var doctor = await _repository.GetByUserIdAsync(userId);
        return doctor != null ? MapToDto(doctor) : null;
    }

    public async Task<DoctorDto> CreateDoctorAsync(CreateDoctorProfileDto dto)
    {
        var doctor = new DoctorProfile
        {
            UserId = dto.UserId,
            FullName = dto.FullName,
            Specialty = dto.Specialty,
            Bio = dto.Bio,
            ConsultationFee = dto.ConsultationFee,
            YearsOfExperience = dto.YearsOfExperience,
            City = dto.City
        };

        await _repository.AddAsync(doctor);
        return MapToDto(doctor);
    }

    public async Task UpdateDoctorAsync(Guid id, UpdateDoctorProfileDto dto)
    {
        var doctor = await _repository.GetByIdAsync(id);
        if (doctor == null) throw new KeyNotFoundException("Doctor not found");

        doctor.Specialty = dto.Specialty;
        doctor.Bio = dto.Bio;
        doctor.ConsultationFee = dto.ConsultationFee;
        doctor.YearsOfExperience = dto.YearsOfExperience;
        doctor.City = dto.City;

        await _repository.UpdateAsync(doctor);
    }

    private static DoctorDto MapToDto(DoctorProfile d)
    {
        return new DoctorDto
        {
            Id = d.Id,
            UserId = d.UserId,
            FullName = d.FullName,
            Specialty = d.Specialty,
            Bio = d.Bio,
            ConsultationFee = d.ConsultationFee,
            YearsOfExperience = d.YearsOfExperience,
            City = d.City
        };
    }
}

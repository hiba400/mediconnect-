using System;

namespace DoctorService.Domain.Entities;

public class DoctorProfile
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    
    public string FullName { get; set; } = string.Empty;

    public string Specialty { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public decimal ConsultationFee { get; set; }

    public int YearsOfExperience { get; set; }

    public string City { get; set; } = string.Empty;
}

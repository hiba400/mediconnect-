namespace MediConnect.Domain.Entities;

public class DoctorProfile
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Specialty { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public decimal ConsultationFee { get; set; }

    public int YearsOfExperience { get; set; }

    public string City { get; set; } = string.Empty;

    // Navigation property
    public ApplicationUser User { get; set; } = null!;
}
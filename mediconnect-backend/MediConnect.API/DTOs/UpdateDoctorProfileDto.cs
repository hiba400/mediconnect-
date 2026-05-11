namespace MediConnect.API.DTOs;

public class UpdateDoctorProfileDto
{
    public string Specialty { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public decimal ConsultationFee { get; set; }

    public int YearsOfExperience { get; set; }

    public string City { get; set; } = string.Empty;
}
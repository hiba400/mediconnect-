namespace MediConnect.API.DTOs;

public class CreateDoctorApplicationDto
{
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; }
    public string Bio { get; set; } = string.Empty;
    public int DocumentCount { get; set; }
}

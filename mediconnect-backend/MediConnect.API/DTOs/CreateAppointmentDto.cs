using System.ComponentModel.DataAnnotations;

namespace MediConnect.API.DTOs;

public class CreateAppointmentDto
{
    [Required]
    public DateTime AppointmentDate { get; set; }

    [Required]
    public string Reason { get; set; } = string.Empty;

    [Required]
    public Guid DoctorId { get; set; }

    [Required]
    public Guid PatientId { get; set; }
}
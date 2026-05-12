namespace MediConnect.Domain.Entities;
using MediConnect.Domain.Enums;
public class Appointment
{
    public Guid Id { get; set; }

    public DateTime AppointmentDate { get; set; }

    public string Reason { get; set; } = string.Empty;

    public Guid PatientId { get; set; }

    public ApplicationUser Patient { get; set; } = null!;

    public Guid DoctorId { get; set; }

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
}
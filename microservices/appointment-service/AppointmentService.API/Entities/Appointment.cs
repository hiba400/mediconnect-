using AppointmentService.API.Enums;

namespace AppointmentService.API.Entities;

public class Appointment
{
    public Guid Id { get; set; }

    public DateTime AppointmentDate { get; set; }

    public string Reason { get; set; } = string.Empty;

    public Guid PatientId { get; set; }

    public Guid DoctorId { get; set; }

    public AppointmentStatus Status { get; set; }
        = AppointmentStatus.Pending;
}
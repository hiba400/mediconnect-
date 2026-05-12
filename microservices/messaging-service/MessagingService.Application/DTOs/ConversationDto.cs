using System;

namespace MessagingService.Application.DTOs;

public class ConversationDto
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public DateTime CreatedAt { get; set; }
}

using System;

namespace MessagingService.Application.DTOs;

public class SendMessageDto
{
    public Guid ConversationId { get; set; }
    public string Content { get; set; } = string.Empty;
}

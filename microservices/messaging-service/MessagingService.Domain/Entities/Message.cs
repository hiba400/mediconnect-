using System;

namespace MessagingService.Domain.Entities;

public class Message
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid ConversationId { get; set; }
    
    public Guid SenderId { get; set; }
    
    public string Content { get; set; } = string.Empty;
    
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    
    public bool IsRead { get; set; } = false;

    public Conversation Conversation { get; set; } = null!;
}

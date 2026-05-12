using System;
using System.Threading.Tasks;
using MessagingService.Application.DTOs;

namespace MessagingService.Application.Interfaces;

public interface IChatClient
{
    Task ReceiveMessage(MessageDto message);
    Task UserTyping(Guid conversationId, Guid userId);
    Task MessageRead(Guid conversationId, Guid messageId);
}

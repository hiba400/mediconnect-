using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MessagingService.Domain.Entities;

namespace MessagingService.Domain.Interfaces;

public interface IMessageRepository
{
    Task<IEnumerable<Message>> GetConversationMessagesAsync(Guid conversationId);
    Task<Message?> GetByIdAsync(Guid id);
    Task AddAsync(Message message);
    Task UpdateAsync(Message message);
}

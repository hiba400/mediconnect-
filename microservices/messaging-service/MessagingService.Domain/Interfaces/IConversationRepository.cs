using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MessagingService.Domain.Entities;

namespace MessagingService.Domain.Interfaces;

public interface IConversationRepository
{
    Task<Conversation?> GetByIdAsync(Guid id);
    Task<Conversation?> GetByUsersAsync(Guid patientId, Guid doctorId);
    Task<IEnumerable<Conversation>> GetUserConversationsAsync(Guid userId);
    Task AddAsync(Conversation conversation);
}

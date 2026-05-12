using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MessagingService.Domain.Entities;
using MessagingService.Domain.Interfaces;
using MessagingService.Infrastructure.Data;

namespace MessagingService.Infrastructure.Repositories;

public class MessageRepository : IMessageRepository
{
    private readonly MessagingDbContext _context;

    public MessageRepository(MessagingDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Message>> GetConversationMessagesAsync(Guid conversationId)
    {
        return await _context.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderBy(m => m.SentAt)
            .ToListAsync();
    }

    public async Task<Message?> GetByIdAsync(Guid id)
    {
        return await _context.Messages.FindAsync(id);
    }

    public async Task AddAsync(Message message)
    {
        await _context.Messages.AddAsync(message);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Message message)
    {
        _context.Messages.Update(message);
        await _context.SaveChangesAsync();
    }
}

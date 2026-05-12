using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MessagingService.Domain.Entities;
using MessagingService.Domain.Interfaces;
using MessagingService.Infrastructure.Data;

namespace MessagingService.Infrastructure.Repositories;

public class ConversationRepository : IConversationRepository
{
    private readonly MessagingDbContext _context;

    public ConversationRepository(MessagingDbContext context)
    {
        _context = context;
    }

    public async Task<Conversation?> GetByIdAsync(Guid id)
    {
        return await _context.Conversations
            .Include(c => c.Messages.OrderBy(m => m.SentAt))
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Conversation?> GetByUsersAsync(Guid patientId, Guid doctorId)
    {
        return await _context.Conversations
            .FirstOrDefaultAsync(c => 
                (c.PatientId == patientId && c.DoctorId == doctorId) ||
                (c.PatientId == doctorId && c.DoctorId == patientId));
    }

    public async Task<IEnumerable<Conversation>> GetUserConversationsAsync(Guid userId)
    {
        return await _context.Conversations
            .Where(c => c.PatientId == userId || c.DoctorId == userId)
            .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
            .ToListAsync();
    }

    public async Task AddAsync(Conversation conversation)
    {
        await _context.Conversations.AddAsync(conversation);
        await _context.SaveChangesAsync();
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using MessagingService.Application.DTOs;
using MessagingService.Domain.Entities;
using MessagingService.Domain.Interfaces;

namespace MessagingService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ConversationsController : ControllerBase
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;

    public ConversationsController(IConversationRepository conversationRepository, IMessageRepository messageRepository)
    {
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetConversations()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var conversations = await _conversationRepository.GetUserConversationsAsync(userId);
        
        var dtos = conversations.Select(c => new ConversationDto
        {
            Id = c.Id,
            PatientId = c.PatientId,
            DoctorId = c.DoctorId,
            CreatedAt = c.CreatedAt
        });

        return Ok(dtos);
    }

    [HttpGet("{id}/messages")]
    public async Task<IActionResult> GetMessages(Guid id)
    {
        var messages = await _messageRepository.GetConversationMessagesAsync(id);
        
        var dtos = messages.Select(m => new MessageDto
        {
            Id = m.Id,
            ConversationId = m.ConversationId,
            SenderId = m.SenderId,
            Content = m.Content,
            SentAt = m.SentAt,
            IsRead = m.IsRead
        });

        return Ok(dtos);
    }

    [HttpPost("initiate")]
    public async Task<IActionResult> InitiateConversation([FromBody] InitiateConversationDto dto)
    {
        var existing = await _conversationRepository.GetByUsersAsync(dto.PatientId, dto.DoctorId);
        if (existing != null) return Ok(new ConversationDto { Id = existing.Id, PatientId = existing.PatientId, DoctorId = existing.DoctorId, CreatedAt = existing.CreatedAt });

        var conversation = new Conversation
        {
            PatientId = dto.PatientId,
            DoctorId = dto.DoctorId
        };

        await _conversationRepository.AddAsync(conversation);
        return Ok(new ConversationDto { Id = conversation.Id, PatientId = conversation.PatientId, DoctorId = conversation.DoctorId, CreatedAt = conversation.CreatedAt });
    }

    [HttpPost("{id}/messages")]
    public async Task<IActionResult> SendMessage(Guid id, [FromBody] SendMessageRequestDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var conversation = await _conversationRepository.GetByIdAsync(id);

        if (conversation == null) return NotFound("Conversation not found");

        var message = new Message
        {
            ConversationId = id,
            SenderId = userId,
            Content = dto.Content
        };

        await _messageRepository.AddAsync(message);

        var messageDto = new MessageDto
        {
            Id = message.Id,
            ConversationId = message.ConversationId,
            SenderId = message.SenderId,
            Content = message.Content,
            SentAt = message.SentAt,
            IsRead = message.IsRead
        };

        return Ok(messageDto);
    }
}

public class InitiateConversationDto
{
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
}

public class SendMessageRequestDto
{
    public string Content { get; set; } = string.Empty;
}

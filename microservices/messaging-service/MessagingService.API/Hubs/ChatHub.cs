using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using MessagingService.Application.Interfaces;
using MessagingService.Application.DTOs;
using MessagingService.Domain.Entities;
using MessagingService.Domain.Interfaces;
using System.Security.Claims;

namespace MessagingService.API.Hubs;

[Authorize]
public class ChatHub : Hub<IChatClient>
{
    private readonly IMessageRepository _messageRepository;
    private readonly IConversationRepository _conversationRepository;

    public ChatHub(IMessageRepository messageRepository, IConversationRepository conversationRepository)
    {
        _messageRepository = messageRepository;
        _conversationRepository = conversationRepository;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }
        await base.OnConnectedAsync();
    }

    public async Task SendMessage(SendMessageDto dto)
    {
        var senderId = Guid.Parse(Context.User!.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var conversation = await _conversationRepository.GetByIdAsync(dto.ConversationId);

        if (conversation == null) throw new HubException("Conversation not found");

        var receiverId = conversation.PatientId == senderId ? conversation.DoctorId : conversation.PatientId;

        var message = new Message
        {
            ConversationId = dto.ConversationId,
            SenderId = senderId,
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

        // Send to receiver
        await Clients.Group(receiverId.ToString()).ReceiveMessage(messageDto);
        // Send back to sender for confirmation
        await Clients.Caller.ReceiveMessage(messageDto);
    }

    public async Task NotifyTyping(Guid conversationId)
    {
        var senderId = Guid.Parse(Context.User!.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var conversation = await _conversationRepository.GetByIdAsync(conversationId);
        if (conversation != null)
        {
            var receiverId = conversation.PatientId == senderId ? conversation.DoctorId : conversation.PatientId;
            await Clients.Group(receiverId.ToString()).UserTyping(conversationId, senderId);
        }
    }

    public async Task MarkAsRead(Guid conversationId, Guid messageId)
    {
        var message = await _messageRepository.GetByIdAsync(messageId);
        var userId = Guid.Parse(Context.User!.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        if (message != null && message.ConversationId == conversationId && message.SenderId != userId)
        {
            message.IsRead = true;
            await _messageRepository.UpdateAsync(message);

            await Clients.Group(message.SenderId.ToString()).MessageRead(conversationId, messageId);
        }
    }
}

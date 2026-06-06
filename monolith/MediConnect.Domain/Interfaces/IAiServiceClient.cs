using System.Collections.Generic;
using System.Threading.Tasks;

namespace MediConnect.Domain.Interfaces
{
    public record ChatMessage(string Role, string Content);

    public record ChatRequest(string Query, List<ChatMessage> ChatHistory);

    public record ChatResponse(string Answer);

    public interface IAiServiceClient
    {
        Task<ChatResponse> GetChatResponseAsync(ChatRequest request, string token);
        Task<ChatResponse> GetAppointmentAssistanceAsync(ChatRequest request, string token);
    }
}

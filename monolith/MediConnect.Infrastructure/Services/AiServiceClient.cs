using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using MediConnect.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace MediConnect.Infrastructure.Services
{
    public class AiServiceClient : IAiServiceClient
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<AiServiceClient> _logger;
        private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        public AiServiceClient(HttpClient httpClient, ILogger<AiServiceClient> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<ChatResponse> GetChatResponseAsync(ChatRequest request, string token)
        {
            return await PostToAiServiceAsync("api/v1/ai/chat", request, token);
        }

        public async Task<ChatResponse> GetAppointmentAssistanceAsync(ChatRequest request, string token)
        {
            return await PostToAiServiceAsync("api/v1/ai/appointment", request, token);
        }

        private async Task<ChatResponse> PostToAiServiceAsync(string endpoint, ChatRequest request, string token)
        {
            try
            {
                var httpRequest = new HttpRequestMessage(HttpMethod.Post, endpoint)
                {
                    Content = JsonContent.Create(request)
                };
                httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.SendAsync(httpRequest);
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("AI Service error: {StatusCode} - {Error}", response.StatusCode, errorContent);
                    throw new Exception($"AI Service returned {response.StatusCode}");
                }

                return await response.Content.ReadFromJsonAsync<ChatResponse>(_jsonOptions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to call AI Service at {Endpoint}", endpoint);
                throw;
            }
        }
    }
}

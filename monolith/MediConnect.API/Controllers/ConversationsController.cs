using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediConnect.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ConversationsController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public ConversationsController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    [HttpGet]
    public Task<IActionResult> GetConversations() =>
        ProxyAsync(HttpMethod.Get, "Conversations");

    [HttpGet("{id:guid}/messages")]
    public Task<IActionResult> GetMessages(Guid id) =>
        ProxyAsync(HttpMethod.Get, $"Conversations/{id}/messages");

    [HttpPost("initiate")]
    public async Task<IActionResult> InitiateConversation()
    {
        using var reader = new StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync();
        return await ProxyAsync(HttpMethod.Post, "Conversations/initiate", body);
    }

    [HttpPost("{id:guid}/messages")]
    public async Task<IActionResult> SendMessage(Guid id)
    {
        using var reader = new StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync();
        return await ProxyAsync(HttpMethod.Post, $"Conversations/{id}/messages", body);
    }

    private async Task<IActionResult> ProxyAsync(HttpMethod method, string path, string? body = null)
    {
        var messagingBase =
            _configuration["MessagingService:Url"] ?? "http://localhost:5197/api";
        var client = _httpClientFactory.CreateClient();

        var authHeader = Request.Headers.Authorization.ToString();
        if (!string.IsNullOrEmpty(authHeader))
        {
            client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", authHeader);
        }

        var request = new HttpRequestMessage(method, $"{messagingBase.TrimEnd('/')}/{path}");
        if (!string.IsNullOrEmpty(body))
        {
            request.Content = new StringContent(body, Encoding.UTF8, "application/json");
        }

        var response = await client.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();
        var contentType = response.Content.Headers.ContentType?.ToString() ?? "application/json";

        return new ContentResult
        {
            StatusCode = (int)response.StatusCode,
            Content = responseBody,
            ContentType = contentType,
        };
    }
}

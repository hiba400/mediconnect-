namespace MediConnect.API.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; } = null!;
    public Guid Id { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
}

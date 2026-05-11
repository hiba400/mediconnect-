using System.ComponentModel.DataAnnotations;

namespace MediConnect.API.DTOs;

public class UpdateUserDto
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}
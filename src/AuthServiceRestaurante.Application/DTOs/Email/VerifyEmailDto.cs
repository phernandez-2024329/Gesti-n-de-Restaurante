using System.ComponentModel.DataAnnotations;

namespace AuthServiceRestaurante.Application.DTOs.Email;

public class VerifyEmailDto
{
    [Required]
    public string Token { get; set; } = string.Empty;
}
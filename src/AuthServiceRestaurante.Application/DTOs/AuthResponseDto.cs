namespace AuthServiceRestaurante.Application.DTOs;

public class AuthResponseDto
{
    public bool Success { get; set; } = false;
    public string Message { get; set; } = string.Empty;
    public string? Token { get; set; }
    public UserDetailsDto? UserDetails { get; set; }
    public DateTime ExpiresAt { get; set; }
}

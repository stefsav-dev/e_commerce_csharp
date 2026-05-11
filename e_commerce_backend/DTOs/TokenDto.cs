namespace e_commerce_backend.DTOs;

public class TokenDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public string Fullname { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
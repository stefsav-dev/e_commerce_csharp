using e_commerce_backend.DTOs;

namespace e_commerce_backend.Services;

public interface IAuthService
{
    Task<TokenDto> RegisterAsync(RegisterDto registerDto);
    Task<TokenDto> LoginAsync(LoginDto loginDto);
    Task<TokenDto> RefreshTokenAsync(RefreshTokenDto refreshTokenDto);
    Task LogoutAsync(int userId, string refreshToken);
}
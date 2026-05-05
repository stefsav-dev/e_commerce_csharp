using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using e_commerce_backend.Data;
using e_commerce_backend.DTOs;
using e_commerce_backend.Helpers;
using e_commerce_backend.Models;

namespace e_commerce_backend.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly JwtSettings _jwtSettings;
    
    public AuthService(AppDbContext context, IOptions<JwtSettings> jwtSettings)
    {
        _context = context;
        _jwtSettings = jwtSettings.Value;
    }
    
    public async Task<TokenDto> RegisterAsync(RegisterDto registerDto)
    {
        // Check if user exists
        if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
            throw new InvalidOperationException("Username already exists");
            
        if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            throw new InvalidOperationException("Email already exists");
        
        // Create new user
        var user = new User
        {
            Username = registerDto.Username,
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            Role = string.IsNullOrEmpty(registerDto.Role) ? "User" : registerDto.Role,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        
        // Generate tokens
        return await GenerateTokensAsync(user);
    }
    
    public async Task<TokenDto> LoginAsync(LoginDto loginDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password");
        
        return await GenerateTokensAsync(user);
    }
    
    public async Task<TokenDto> RefreshTokenAsync(RefreshTokenDto refreshTokenDto)
    {
        // Validate access token
        var principal = GetPrincipalFromExpiredToken(refreshTokenDto.AccessToken);
        var userId = int.Parse(principal.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        
        // Find refresh token in database
        var storedRefreshToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshTokenDto.RefreshToken);
            
        if (storedRefreshToken == null || storedRefreshToken.IsRevoked || 
            storedRefreshToken.ExpiresAt < DateTime.UtcNow ||
            storedRefreshToken.UserId != userId)
            throw new UnauthorizedAccessException("Invalid refresh token");
        
        // Revoke old refresh token
        storedRefreshToken.IsRevoked = true;
        storedRefreshToken.RevokedAt = DateTime.UtcNow;
        
        // Generate new tokens
        var tokens = await GenerateTokensAsync(storedRefreshToken.User);
        
        await _context.SaveChangesAsync();
        
        return tokens;
    }
    
    public async Task LogoutAsync(int userId, string refreshToken)
    {
        var token = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken && rt.UserId == userId);
            
        if (token != null)
        {
            token.IsRevoked = true;
            token.RevokedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }
    
    private async Task<TokenDto> GenerateTokensAsync(User user)
    {
        var accessToken = GenerateAccessToken(user);
        var refreshToken = GenerateRefreshToken();
        
        // Save refresh token to database
        var refreshTokenEntity = new RefreshToken
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays),
            CreatedAt = DateTime.UtcNow
        };
        
        _context.RefreshTokens.Add(refreshTokenEntity);
        await _context.SaveChangesAsync();
        
        return new TokenDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
            Username = user.Username,
            Role = user.Role
        };
    }
    
    private string GenerateAccessToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        
        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
            signingCredentials: credentials
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
    
    private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey)),
            ValidateLifetime = false, // Don't validate lifetime here
            ValidIssuer = _jwtSettings.Issuer,
            ValidAudience = _jwtSettings.Audience
        };
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
        
        if (securityToken is not JwtSecurityToken jwtSecurityToken || 
            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            throw new SecurityTokenException("Invalid token");
        
        return principal;
    }
}

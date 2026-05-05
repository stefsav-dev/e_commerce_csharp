using System.ComponentModel.DataAnnotations;

namespace e_commerce_backend.DTOs;

public class RegisterDto
{
    [Required]
    [MinLength(3)]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string Role { get; set; } = "User"; 
}
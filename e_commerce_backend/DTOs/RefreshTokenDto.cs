using System.ComponentModel.DataAnnotations;

namespace e_commerce_backend.DTOs
{
    public class RefreshTokenDto
    {
        [Required]
        public string AccessToken { get; set; } = string.Empty;
        
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}   
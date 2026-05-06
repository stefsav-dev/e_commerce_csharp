using System.ComponentModel.DataAnnotations;

namespace e_commerce_backend.DTOs;

public class UpdateOrderStatusDto
{
    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = String.Empty;
}
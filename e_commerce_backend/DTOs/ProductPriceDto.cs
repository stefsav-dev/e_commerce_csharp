using System.ComponentModel.DataAnnotations;
using e_commerce_backend.Models;

namespace e_commerce_backend.DTOs;

public class ProductPriceDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public decimal Price { get; set; }
    public PriceType PriceType { get; set; }
    public string PriceLabel { get; set; } = string.Empty;
    public DateTime EffectiveDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public bool IsActive { get; set; }
}

public class CreatePriceDto
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }
    
    [Required]
    public PriceType PriceType { get; set; } = PriceType.Regular;
    
    [MaxLength(100)]
    public string PriceLabel { get; set; } = string.Empty;
    
    public DateTime EffectiveDate { get; set; } = DateTime.UtcNow;
    
    public DateTime? ExpiryDate { get; set; }
}


public class UpdatePriceDto
{
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal? Price { get; set; }
    
    public PriceType? PriceType { get; set; }
    
    [MaxLength(100)]
    public string PriceLabel { get; set; } = string.Empty;
    
    public DateTime? EffectiveDate { get; set; }
    
    public DateTime? ExpiryDate { get; set; }
    
    public bool? IsActive { get; set; }
}
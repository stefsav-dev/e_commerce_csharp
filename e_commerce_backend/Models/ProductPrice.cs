using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace e_commerce_backend.Models;

public class ProductPrice
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int ProductId { get; set; }
    
    [ForeignKey("ProductId")]
    public Product Product { get; set; } = null!;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    
    [Required]
    public PriceType PriceType { get; set; } = PriceType.Regular;
    
    [MaxLength(100)]
    public string PriceLabel { get; set; } = string.Empty; 
    
    public DateTime EffectiveDate { get; set; } = DateTime.UtcNow;
    
    public DateTime? ExpiryDate { get; set; } 
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
}

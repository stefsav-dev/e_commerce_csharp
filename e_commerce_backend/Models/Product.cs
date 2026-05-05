using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace e_commerce_backend.Models;

public class Product
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string SKU { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;
    public int StockQuantity { get; set; } = 0;

    public int MinStockQuantity { get; set; } = 10;

    public bool IsActive {get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public int CreatedByUserId { get; set; }

    [ForeignKey("CreatedByUserId")]
    public User CreatedBy { get; set; } = null!;

    public ICollection<ProductPrice> Prices { get; set; } = new List<ProductPrice>();
}

public enum PriceType
{
    Regular = 1,
    Wholesale = 2,
    Promo = 3,
    Special = 4
}
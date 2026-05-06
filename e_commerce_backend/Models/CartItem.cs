using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace e_commerce_backend.Models;

public class CartItem
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int CardId { get; set; }
    
    [ForeignKey("CartId")]
    public Cart Cart { get; set; } = null!;
    
    [Required]
    public int ProductId { get; set; } 
    
    [ForeignKey("ProductId")]
    public Product Product { get; set; } = null!;

    [Required]
    public int Quantity { get; set; }

    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal UnitPrice { get; set; }

    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal Subtotal { get; set; }
    
    public int? PriceId { get; set; }
    
    [ForeignKey("PriceId")]
    public ProductPrice? SelectedPrice { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
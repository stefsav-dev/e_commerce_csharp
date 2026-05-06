using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace e_commerce_backend.Models;

public class OrderDetail
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int OrderId { get; set; }

    [ForeignKey("OrderId")]
    public Order Order { get; set; } = null!;

    [Required]
    public int ProductId { get; set; }

    [ForeignKey("ProductId")]
    public Product Product { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string ProductName { get; set; } = String.Empty;

    [Required]
    [MaxLength(50)]
    public string ProductSKU { get; set; } = String.Empty;

    [Required]
    public int Quantity { get; set; }

    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal UnitPrice { get; set; }

    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal Subtotal { get; set; }

    [MaxLength(100)]
    public string PriceType { get; set; } = String.Empty;


}
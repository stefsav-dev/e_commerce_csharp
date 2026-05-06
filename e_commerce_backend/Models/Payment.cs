using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace e_commerce_backend.Models;

public class Payment
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string OrderNumber { get; set; } = String.Empty;

    [Required]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    [Required]
    public int CartId { get; set; }

    [ForeignKey("CardId")]
    public Cart Cart { get; set; } = null!;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal  SubtotalAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal DiscountAmount { get; set; } = 0;

    [MaxLength(200)]
    public string DiscountDescription { get; set; } = String.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal TaxAmount{ get; set; } = 0;

    [Column(TypeName = "decimal(5,2)")]
    public decimal TaxRate { get; set; } = 11.00m;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Pending";

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    public DateTime? PaymentDate { get; set; }
    
    public DateTime? ShippedDate { get; set; }
    
    public DateTime? DeliveredDate { get; set; }
    
    [MaxLength(500)]
    public string Notes { get; set; } = string.Empty;
    
    // Navigation properties
    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    public Payment? Payment { get; set; }
}
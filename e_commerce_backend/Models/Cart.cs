using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace e_commerce_backend.Models;

public class Cart
{
    [Key]
    public int Id { get; set; }
    [Required]
    public int UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; } = null;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsCheckedOut { get; set; } = false;
    public DateTime? CheckedOutAt { get; set; }

    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public Order? Order { get; set; }
}
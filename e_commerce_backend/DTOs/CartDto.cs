using System.ComponentModel.DataAnnotations;

namespace e_commerce_backend.DTOs;

public class CartDto
{
    public int CartId { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public List<CartItemDto> Items { get; set; } = new();
    public CartSummaryDto Summary { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CartItemDto
{
    public int CartItemId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductSKU { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal { get; set; }
    public string PriceType { get; set; } = string.Empty;
    public DateTime AddedAt { get; set; }
}

public class CartSummaryDto
{
    public int TotalItems { get; set; } // Total jumlah item (sum quantity)
    public int UniqueItems { get; set; } // Total jenis produk
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public string DiscountDescription { get; set; } = string.Empty;
    public decimal TaxRate { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }
}

public class AddToCartDto
{
    [Required]
    public int ProductId { get; set; }
    
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; } = 1;
    
    public int? PriceId { get; set; } // Optional: pilih tipe harga spesifik
}

public class UpdateCartItemDto
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }
}

public class CheckoutDto
{
    [MaxLength(500)]
    public string Notes { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string PaymentMethod { get; set; } = "Bank Transfer";
    
    [MaxLength(50)]
    public string? CouponCode { get; set; } // Optional kupon diskon
}

public class CheckoutResponseDto
{
    public OrderDto Order { get; set; } = new();
    public PaymentDto Payment { get; set; } = new();
    public string Message { get; set; } = string.Empty;
}

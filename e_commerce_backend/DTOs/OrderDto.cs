namespace e_commerce_backend.DTOs;

public class OrderDto
{
    public int OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public int UserId { get; set;}
    public string Fullname { get; set; } = string.Empty;
    public List<OrderDetailDto> OrderDetails { get; set; } = new();
    public decimal SubtotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public string DiscountDescription { get; set; } = string.Empty;
    public decimal TaxRate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public string Notes { get; set; } = string.Empty;
    public PaymentDto? Payment { get; set; }
}

public class OrderDetailDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductSKU { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal { get; set; }
    public string PriceType { get; set; } = string.Empty;
}

public class PaymentDto
{
    public int PaymentId { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; }
}

public class OrderFilterDto
{
    public int? UserId { get; set; }
    public string? Status { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string? SearchTerm { get; set; }
}

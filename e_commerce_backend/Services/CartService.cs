using Microsoft.EntityFrameworkCore;
using e_commerce_backend.Data;
using e_commerce_backend.DTOs;
using e_commerce_backend.Models;

namespace e_commerce_backend.Services;

public class CartService : ICartService
{
    private const decimal TaxRate = 11.00m;
    private readonly AppDbContext _context;

    public CartService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CartDto> GetCartAsync(int userId)
    {
        var cart = await GetOrCreateActiveCartAsync(userId);
        return MapToCartDto(cart);
    }

    public async Task<CartDto> AddToCartAsync(int userId, AddToCartDto addToCartDto)
    {
        var cart = await GetOrCreateActiveCartAsync(userId);
        var product = await _context.Products
            .Include(p => p.ProductPrices)
            .FirstOrDefaultAsync(p => p.Id == addToCartDto.ProductId && p.IsActive);

        if (product == null)
            throw new KeyNotFoundException($"Product with ID {addToCartDto.ProductId} not found");

        if (product.StockQuantity < addToCartDto.Quantity)
            throw new InvalidOperationException("Product stock is not enough");

        var selectedPrice = SelectPrice(product, addToCartDto.PriceId);
        var cartItem = cart.CartItems.FirstOrDefault(ci =>
            ci.ProductId == product.Id && ci.PriceId == selectedPrice.Id);

        if (cartItem == null)
        {
            cart.CartItems.Add(new CartItem
            {
                ProductId = product.Id,
                Quantity = addToCartDto.Quantity,
                UnitPrice = selectedPrice.Price,
                Subtotal = selectedPrice.Price * addToCartDto.Quantity,
                PriceId = selectedPrice.Id,
                AddedAt = DateTime.UtcNow
            });
        }
        else
        {
            var newQuantity = cartItem.Quantity + addToCartDto.Quantity;
            if (product.StockQuantity < newQuantity)
                throw new InvalidOperationException("Product stock is not enough");

            cartItem.Quantity = newQuantity;
            cartItem.Subtotal = cartItem.UnitPrice * newQuantity;
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    public async Task<CartDto> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto updateDto)
    {
        var cartItem = await _context.CartItems
            .Include(ci => ci.Cart)
            .Include(ci => ci.Product)
            .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.Cart.UserId == userId && !ci.Cart.IsCheckedOut);

        if (cartItem == null)
            throw new KeyNotFoundException($"Cart item with ID {cartItemId} not found");

        if (cartItem.Product.StockQuantity < updateDto.Quantity)
            throw new InvalidOperationException("Product stock is not enough");

        cartItem.Quantity = updateDto.Quantity;
        cartItem.Subtotal = cartItem.UnitPrice * updateDto.Quantity;
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return await GetCartAsync(userId);
    }

    public async Task<CartDto> RemoveFromCartAsync(int userId, int cartItemId)
    {
        var cartItem = await _context.CartItems
            .Include(ci => ci.Cart)
            .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.Cart.UserId == userId && !ci.Cart.IsCheckedOut);

        if (cartItem == null)
            throw new KeyNotFoundException($"Cart item with ID {cartItemId} not found");

        cartItem.Cart.UpdatedAt = DateTime.UtcNow;
        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    public async Task ClearCartAsync(int userId)
    {
        var cart = await GetOrCreateActiveCartAsync(userId);
        _context.CartItems.RemoveRange(cart.CartItems);
        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
    }

    public async Task<CheckoutResponseDto> CheckoutAsync(int userId, CheckoutDto checkoutDto)
    {
        var cart = await GetOrCreateActiveCartAsync(userId);
        if (!cart.CartItems.Any())
            throw new InvalidOperationException("Cart is empty");

        foreach (var item in cart.CartItems)
        {
            if (item.Product.StockQuantity < item.Quantity)
                throw new InvalidOperationException($"Product '{item.Product.Name}' stock is not enough");
        }

        var summary = CalculateSummary(cart.CartItems);
        var order = new Order
        {
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}-{userId}",
            UserId = userId,
            CartId = cart.Id,
            SubtotalAmount = summary.Subtotal,
            DiscountAmount = summary.Discount,
            DiscountDescription = summary.DiscountDescription,
            TaxAmount = summary.TaxAmount,
            TaxRate = summary.TaxRate,
            TotalAmount = summary.TotalAmount,
            Notes = checkoutDto.Notes,
            OrderDate = DateTime.UtcNow,
            OrderDetails = cart.CartItems.Select(item => new OrderDetail
            {
                ProductId = item.ProductId,
                ProductName = item.Product.Name,
                ProductSKU = item.Product.SKU,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Subtotal = item.Subtotal,
                PriceType = item.SelectedPrice?.PriceType.ToString() ?? string.Empty
            }).ToList()
        };

        foreach (var item in cart.CartItems)
        {
            item.Product.StockQuantity -= item.Quantity;
        }

        cart.IsCheckedOut = true;
        cart.CheckedOutAt = DateTime.UtcNow;
        cart.UpdatedAt = DateTime.UtcNow;

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        var payment = new Payment
        {
            OrderId = order.Id,
            PaymentMethod = checkoutDto.PaymentMethod,
            Amount = order.TotalAmount,
            Status = "Pending",
            TransactionId = string.Empty
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        order.Payment = payment;

        return new CheckoutResponseDto
        {
            Order = MapToOrderDto(order),
            Payment = MapToPaymentDto(payment),
            Message = "Checkout successful"
        };
    }

    public async Task<List<OrderDto>> GetOrderHistoryAsync(int userId)
    {
        var orders = await BuildOrderQuery()
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return orders.Select(MapToOrderDto).ToList();
    }

    public async Task<OrderDto> GetOrderDetailAsync(int userId, int orderId)
    {
        var query = BuildOrderQuery().Where(o => o.Id == orderId);
        if (userId > 0)
        {
            query = query.Where(o => o.UserId == userId);
        }

        var order = await query.FirstOrDefaultAsync();
        if (order == null)
            throw new KeyNotFoundException($"Order with ID {orderId} not found");

        return MapToOrderDto(order);
    }

    public async Task<List<OrderDto>> GetAllOrdersAsync(OrderFilterDto filter)
    {
        var query = BuildOrderQuery();

        if (filter.UserId.HasValue)
            query = query.Where(o => o.UserId == filter.UserId.Value);

        if (!string.IsNullOrWhiteSpace(filter.Status))
            query = query.Where(o => o.Status == filter.Status);

        if (filter.FromDate.HasValue)
            query = query.Where(o => o.OrderDate >= filter.FromDate.Value);

        if (filter.ToDate.HasValue)
            query = query.Where(o => o.OrderDate <= filter.ToDate.Value);

        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
            var searchTerm = filter.SearchTerm.ToLower();
            query = query.Where(o =>
                o.OrderNumber.ToLower().Contains(searchTerm) ||
                o.User.Fullname.ToLower().Contains(searchTerm));
        }

        var orders = await query.OrderByDescending(o => o.OrderDate).ToListAsync();
        return orders.Select(MapToOrderDto).ToList();
    }

    public async Task UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDto statusDto)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order == null)
            throw new KeyNotFoundException($"Order with ID {orderId} not found");

        order.Status = statusDto.Status;
        var now = DateTime.UtcNow;

        if (statusDto.Status.Equals("Paid", StringComparison.OrdinalIgnoreCase))
            order.PaymentDate = now;
        else if (statusDto.Status.Equals("Shipped", StringComparison.OrdinalIgnoreCase))
            order.ShippedDate = now;
        else if (statusDto.Status.Equals("Delivered", StringComparison.OrdinalIgnoreCase))
            order.DeliveredDate = now;

        await _context.SaveChangesAsync();
    }

    private async Task<Cart> GetOrCreateActiveCartAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.User)
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.SelectedPrice)
            .FirstOrDefaultAsync(c => c.UserId == userId && !c.IsCheckedOut);

        if (cart != null)
            return cart;

        cart = new Cart
        {
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Carts.Add(cart);
        await _context.SaveChangesAsync();

        return await _context.Carts
            .Include(c => c.User)
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.SelectedPrice)
            .FirstAsync(c => c.Id == cart.Id);
    }

    private static ProductPrice SelectPrice(Product product, int? priceId)
    {
        var now = DateTime.UtcNow;
        var activePrices = product.ProductPrices
            .Where(pp => pp.IsActive && pp.EffectiveDate <= now && (!pp.ExpiryDate.HasValue || pp.ExpiryDate >= now))
            .ToList();

        var selectedPrice = priceId.HasValue
            ? activePrices.FirstOrDefault(pp => pp.Id == priceId.Value)
            : activePrices.FirstOrDefault(pp => pp.PriceType == PriceType.Regular) ?? activePrices.FirstOrDefault();

        if (selectedPrice == null)
            throw new InvalidOperationException("Product does not have an active price");

        return selectedPrice;
    }

    private static CartDto MapToCartDto(Cart cart)
    {
        var summary = CalculateSummary(cart.CartItems);

        return new CartDto
        {
            CartId = cart.Id,
            UserId = cart.UserId,
            Fullname = cart.User?.Fullname ?? string.Empty,
            Items = cart.CartItems.Select(item => new CartItemDto
            {
                CartItemId = item.Id,
                ProductId = item.ProductId,
                ProductName = item.Product?.Name ?? string.Empty,
                ProductSKU = item.Product?.SKU ?? string.Empty,
                Category = item.Product?.Category ?? string.Empty,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Subtotal = item.Subtotal,
                PriceType = item.SelectedPrice?.PriceType.ToString() ?? string.Empty,
                AddedAt = item.AddedAt
            }).ToList(),
            Summary = summary,
            CreatedAt = cart.CreatedAt,
            UpdatedAt = cart.UpdatedAt
        };
    }

    private static CartSummaryDto CalculateSummary(IEnumerable<CartItem> items)
    {
        var itemList = items.ToList();
        var subtotal = itemList.Sum(i => i.Subtotal);
        var discount = 0m;
        var taxAmount = (subtotal - discount) * TaxRate / 100m;

        return new CartSummaryDto
        {
            TotalItems = itemList.Sum(i => i.Quantity),
            UniqueItems = itemList.Count,
            Subtotal = subtotal,
            Discount = discount,
            DiscountDescription = string.Empty,
            TaxRate = TaxRate,
            TaxAmount = taxAmount,
            TotalAmount = subtotal - discount + taxAmount
        };
    }

    private IQueryable<Order> BuildOrderQuery()
    {
        return _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderDetails)
            .Include(o => o.Payment)
            .AsQueryable();
    }

    private static OrderDto MapToOrderDto(Order order)
    {
        return new OrderDto
        {
            OrderId = order.Id,
            OrderNumber = order.OrderNumber,
            UserId = order.UserId,
            Fullname = order.User?.Fullname ?? string.Empty,
            OrderDetails = order.OrderDetails.Select(detail => new OrderDetailDto
            {
                ProductId = detail.ProductId,
                ProductName = detail.ProductName,
                ProductSKU = detail.ProductSKU,
                Quantity = detail.Quantity,
                UnitPrice = detail.UnitPrice,
                Subtotal = detail.Subtotal,
                PriceType = detail.PriceType
            }).ToList(),
            SubtotalAmount = order.SubtotalAmount,
            DiscountAmount = order.DiscountAmount,
            DiscountDescription = order.DiscountDescription,
            TaxRate = order.TaxRate,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            OrderDate = order.OrderDate,
            Notes = order.Notes,
            Payment = order.Payment == null ? null : MapToPaymentDto(order.Payment)
        };
    }

    private static PaymentDto MapToPaymentDto(Payment payment)
    {
        return new PaymentDto
        {
            PaymentId = payment.Id,
            PaymentMethod = payment.PaymentMethod,
            Amount = payment.Amount,
            Status = payment.Status,
            TransactionId = payment.TransactionId,
            PaymentDate = payment.PaymentDate ?? DateTime.MinValue
        };
    }
}

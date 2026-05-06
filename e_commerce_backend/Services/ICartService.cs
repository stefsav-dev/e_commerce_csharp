using e_commerce_backend.DTOs;

namespace e_commerce_backend.Services;

public interface ICartService
{
    Task<CartDto> GetCartAsync(int userId);
    Task<CartDto> AddToCartAsync(int userId, AddToCartDto addToCartDto);
    Task<CartDto> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto updateDto);
    Task<CartDto> RemoveFromCartAsync(int userId, int cartItemId);
    Task ClearCartAsync(int userId);
    Task<CheckoutResponseDto> CheckoutAsync(int userId, CheckoutDto checkoutDto);
    Task<List<OrderDto>> GetOrderHistoryAsync(int userId);
    Task<OrderDto> GetOrderDetailAsync(int userId, int orderId);
    Task<List<OrderDto>> GetAllOrdersAsync(OrderFilterDto filter);
    Task UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDto statusDto);
}

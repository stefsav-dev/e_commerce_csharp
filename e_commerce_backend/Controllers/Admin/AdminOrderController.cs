using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using e_commerce_backend.DTOs;
using e_commerce_backend.Services;

namespace e_commerce_backend.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Roles = "Admin")]
public class OrdersController : ControllerBase
{
    private readonly ICartService _cartService;
    
    public OrdersController(ICartService cartService)
    {
        _cartService = cartService;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetAllOrders([FromQuery] OrderFilterDto filter)
    {
        var orders = await _cartService.GetAllOrdersAsync(filter);
        return Ok(orders);
    }
    
    [HttpGet("{orderId}")]
    public async Task<ActionResult<OrderDto>> GetOrderDetail(int orderId)
    {
        try
        {
            var userId = 0; // Admin can view any order
            var order = await _cartService.GetOrderDetailAsync(userId, orderId);
            return Ok(order);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
    
    [HttpPut("{orderId}/status")]
    public async Task<ActionResult> UpdateOrderStatus(int orderId, [FromBody] UpdateOrderStatusDto statusDto)
    {
        await _cartService.UpdateOrderStatusAsync(orderId, statusDto);
        return Ok(new { message = "Status updated successfully" });
    }
}

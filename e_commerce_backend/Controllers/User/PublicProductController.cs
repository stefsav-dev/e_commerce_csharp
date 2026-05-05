using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using e_commerce_backend.DTOs;
using e_commerce_backend.Services;

namespace e_commerce_backend.Controllers.User;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "User,Admin")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    
    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }
    
    [HttpGet]
    public async Task<ActionResult<PagedResponse<ProductDto>>> GetProducts(
        [FromQuery] ProductFilterDto filter)
    {
        // Only show active products for regular users
        if (!User.IsInRole("Admin"))
        {
            filter.IsActive = true;
        }
        
        var products = await _productService.GetProductsAsync(filter);
        return Ok(products);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        try
        {
            var product = await _productService.GetProductByIdAsync(id);
            
            // Regular users can only see active products
            if (!User.IsInRole("Admin") && !product.IsActive)
            {
                return NotFound(new { message = "Product not found" });
            }
            
            return Ok(product);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Product not found" });
        }
    }
}
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using e_commerce_backend.DTOs;
using e_commerce_backend.Services;

namespace e_commerce_backend.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Roles = "Admin")]
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
        var products = await _productService.GetProductsAsync(filter);
        return Ok(products);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        try
        {
            var product = await _productService.GetProductByIdAsync(id);
            return Ok(product);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
    
    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto createDto)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var product = await _productService.CreateProductAsync(createDto, userId);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(int id, [FromBody] UpdateProductDto updateDto)
    {
        try
        {
            var product = await _productService.UpdateProductAsync(id, updateDto);
            return Ok(product);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        try
        {
            await _productService.DeleteProductAsync(id);
            return Ok(new { message = "Product deleted successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
    
    [HttpPost("{productId}/prices")]
    public async Task<ActionResult<ProductPriceDto>> AddPrice(int productId, [FromBody] CreatePriceDto priceDto)
    {
        try
        {
            var price = await _productService.AddPriceAsync(productId, priceDto);
            return CreatedAtAction(nameof(GetProduct), new { id = productId }, price);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
    
    [HttpPut("prices/{priceId}")]
    public async Task<ActionResult<ProductPriceDto>> UpdatePrice(int priceId, [FromBody] UpdatePriceDto priceDto)
    {
        try
        {
            var price = await _productService.UpdatePriceAsync(priceId, priceDto);
            return Ok(price);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
    
    [HttpDelete("prices/{priceId}")]
    public async Task<ActionResult> DeletePrice(int priceId)
    {
        try
        {
            await _productService.DeletePriceAsync(priceId);
            return Ok(new { message = "Price deleted successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
    
    [HttpGet("low-stock")]
    public async Task<ActionResult<List<ProductDto>>> GetLowStockProducts()
    {
        var products = await _productService.GetLowStockProductsAsync();
        return Ok(products);
    }
}
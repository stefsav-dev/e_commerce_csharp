using e_commerce_backend.DTOs;

namespace e_commerce_backend.Services;

public interface IProductService
{
    Task<PagedResponse<ProductDto>> GetProductsAsync(ProductFilterDto filter);
    Task<ProductDto> GetProductByIdAsync(int id);
    Task<ProductDto> CreateProductAsync(CreateProductDto createDto, int userId);
    Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto updateDto);
    Task DeleteProductAsync(int id);
    Task<ProductPriceDto> AddPriceAsync(int productId, CreatePriceDto priceDto);
    Task<ProductPriceDto> UpdatePriceAsync(int priceId, UpdatePriceDto priceDto);
    Task DeletePriceAsync(int priceId);
    Task<List<ProductDto>> GetLowStockProductsAsync();
}
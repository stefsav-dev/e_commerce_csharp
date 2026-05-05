using Microsoft.EntityFrameworkCore;
using e_commerce_backend.Data;
using e_commerce_backend.DTOs;
using e_commerce_backend.Models;

namespace e_commerce_backend.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;
    
    public ProductService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<PagedResponse<ProductDto>> GetProductsAsync(ProductFilterDto filter)
    {
        var query = _context.Products
            .Include(p => p.ProductPrices.Where(pp => pp.IsActive))
            .AsQueryable();
        
        // Apply filters
        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
            var searchTerm = filter.SearchTerm.ToLower();
            query = query.Where(p => 
                p.Name.ToLower().Contains(searchTerm) || 
                p.SKU.ToLower().Contains(searchTerm) ||
                p.Description.ToLower().Contains(searchTerm));
        }
        
        if (!string.IsNullOrWhiteSpace(filter.Category))
        {
            query = query.Where(p => p.Category == filter.Category);
        }
        
        if (filter.IsActive.HasValue)
        {
            query = query.Where(p => p.IsActive == filter.IsActive.Value);
        }
        
        if (filter.LowStock == true)
        {
            query = query.Where(p => p.StockQuantity <= p.MinStockLevel);
        }
        
        // Apply sorting
        query = filter.SortBy?.ToLower() switch
        {
            "price" => filter.SortDescending 
                ? query.OrderByDescending(p => p.ProductPrices
                    .Where(pp => pp.PriceType == PriceType.Regular)
                    .Select(pp => pp.Price)
                    .FirstOrDefault())
                : query.OrderBy(p => p.ProductPrices
                    .Where(pp => pp.PriceType == PriceType.Regular)
                    .Select(pp => pp.Price)
                    .FirstOrDefault()),
                    
            "stock" => filter.SortDescending 
                ? query.OrderByDescending(p => p.StockQuantity)
                : query.OrderBy(p => p.StockQuantity),
                
            "date" => filter.SortDescending 
                ? query.OrderByDescending(p => p.CreatedAt)
                : query.OrderBy(p => p.CreatedAt),
                
            _ => filter.SortDescending 
                ? query.OrderByDescending(p => p.Name)
                : query.OrderBy(p => p.Name)
        };
        
        var totalCount = await query.CountAsync();
        
        var products = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(p => MapToProductDto(p))
            .ToListAsync();
        
        return new PagedResponse<ProductDto>
        {
            Data = products,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }
    
    public async Task<ProductDto> GetProductByIdAsync(int id)
    {
        var product = await _context.Products
            .Include(p => p.ProductPrices.Where(pp => pp.IsActive))
            .FirstOrDefaultAsync(p => p.Id == id);
            
        if (product == null)
            throw new KeyNotFoundException($"Product with ID {id} not found");
            
        return MapToProductDto(product);
    }
    
    public async Task<ProductDto> CreateProductAsync(CreateProductDto createDto, int userId)
    {
        // Check if SKU already exists
        if (await _context.Products.AnyAsync(p => p.SKU == createDto.SKU))
            throw new InvalidOperationException($"SKU '{createDto.SKU}' already exists");
        
        var product = new Product
        {
            Name = createDto.Name,
            Description = createDto.Description,
            SKU = createDto.SKU,
            Category = createDto.Category,
            StockQuantity = createDto.StockQuantity,
            MinStockLevel = createDto.MinStockLevel,
            CreatedByUserId = userId,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.Products.Add(product);
        
        // Add prices if provided
        if (createDto.Prices.Any())
        {
            foreach (var priceDto in createDto.Prices)
            {
                var price = new ProductPrice
                {
                    ProductId = product.Id,
                    Price = priceDto.Price,
                    PriceType = priceDto.PriceType,
                    PriceLabel = priceDto.PriceLabel,
                    EffectiveDate = priceDto.EffectiveDate,
                    ExpiryDate = priceDto.ExpiryDate,
                    CreatedAt = DateTime.UtcNow
                };
                product.ProductPrices.Add(price);
            }
        }
        else
        {
            // Add default regular price
            product.ProductPrices.Add(new ProductPrice
            {
                Price = 0,
                PriceType = PriceType.Regular,
                PriceLabel = "Harga Reguler",
                EffectiveDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            });
        }
        
        await _context.SaveChangesAsync();
        
        return await GetProductByIdAsync(product.Id);
    }
    
    public async Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto updateDto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            throw new KeyNotFoundException($"Product with ID {id} not found");
        
        if (!string.IsNullOrWhiteSpace(updateDto.Name))
            product.Name = updateDto.Name;
            
        if (updateDto.Description != null)
            product.Description = updateDto.Description;
            
        if (!string.IsNullOrWhiteSpace(updateDto.Category))
            product.Category = updateDto.Category;
            
        if (updateDto.StockQuantity.HasValue)
            product.StockQuantity = updateDto.StockQuantity.Value;
            
        if (updateDto.MinStockLevel.HasValue)
            product.MinStockLevel = updateDto.MinStockLevel.Value;
            
        if (updateDto.IsActive.HasValue)
            product.IsActive = updateDto.IsActive.Value;
            
        product.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        
        return await GetProductByIdAsync(id);
    }
    
    public async Task DeleteProductAsync(int id)
    {
        var product = await _context.Products
            .Include(p => p.ProductPrices)
            .FirstOrDefaultAsync(p => p.Id == id);
            
        if (product == null)
            throw new KeyNotFoundException($"Product with ID {id} not found");
        
        // Soft delete - just deactivate
        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;
        
        // Deactivate all prices
        foreach (var price in product.ProductPrices)
        {
            price.IsActive = false;
            price.UpdatedAt = DateTime.UtcNow;
        }
        
        await _context.SaveChangesAsync();
    }
    
    public async Task<ProductPriceDto> AddPriceAsync(int productId, CreatePriceDto priceDto)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product == null)
            throw new KeyNotFoundException($"Product with ID {productId} not found");
        
        var price = new ProductPrice
        {
            ProductId = productId,
            Price = priceDto.Price,
            PriceType = priceDto.PriceType,
            PriceLabel = priceDto.PriceLabel,
            EffectiveDate = priceDto.EffectiveDate,
            ExpiryDate = priceDto.ExpiryDate,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.ProductPrices.Add(price);
        await _context.SaveChangesAsync();
        
        return MapToPriceDto(price);
    }
    
    public async Task<ProductPriceDto> UpdatePriceAsync(int priceId, UpdatePriceDto priceDto)
    {
        var price = await _context.ProductPrices.FindAsync(priceId);
        if (price == null)
            throw new KeyNotFoundException($"Price with ID {priceId} not found");
        
        if (priceDto.Price.HasValue)
            price.Price = priceDto.Price.Value;
            
        if (priceDto.PriceType.HasValue)
            price.PriceType = priceDto.PriceType.Value;
            
        if (priceDto.PriceLabel != null)
            price.PriceLabel = priceDto.PriceLabel;
            
        if (priceDto.EffectiveDate.HasValue)
            price.EffectiveDate = priceDto.EffectiveDate.Value;
            
        price.ExpiryDate = priceDto.ExpiryDate; // Can be null
            
        if (priceDto.IsActive.HasValue)
            price.IsActive = priceDto.IsActive.Value;
            
        price.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        
        return MapToPriceDto(price);
    }
    
    public async Task DeletePriceAsync(int priceId)
    {
        var price = await _context.ProductPrices.FindAsync(priceId);
        if (price == null)
            throw new KeyNotFoundException($"Price with ID {priceId} not found");
        
        price.IsActive = false;
        price.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
    }
    
    public async Task<List<ProductDto>> GetLowStockProductsAsync()
    {
        var products = await _context.Products
            .Include(p => p.ProductPrices.Where(pp => pp.IsActive))
            .Where(p => p.StockQuantity <= p.MinStockLevel && p.IsActive)
            .Select(p => MapToProductDto(p))
            .ToListAsync();
            
        return products;
    }
    
    private static ProductDto MapToProductDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            SKU = product.SKU,
            Category = product.Category,
            StockQuantity = product.StockQuantity,
            MinStockLevel = product.MinStockLevel,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            Prices = product.ProductPrices
                .Where(pp => pp.IsActive)
                .Select(MapToPriceDto)
                .ToList()
        };
    }
    
    private static ProductPriceDto MapToPriceDto(ProductPrice price)
    {
        return new ProductPriceDto
        {
            Id = price.Id,
            ProductId = price.ProductId,
            Price = price.Price,
            PriceType = price.PriceType,
            PriceLabel = price.PriceLabel,
            EffectiveDate = price.EffectiveDate,
            ExpiryDate = price.ExpiryDate,
            IsActive = price.IsActive
        };
    }
}
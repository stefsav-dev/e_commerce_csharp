using Microsoft.EntityFrameworkCore;
using e_commerce_backend.Models;

namespace e_commerce_backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductPrice> ProductPrices { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderDetail> OrderDetails { get; set; }
    public DbSet<Payment> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
            
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
            
        modelBuilder.Entity<RefreshToken>()
            .HasIndex(rt => rt.Token)
            .IsUnique();

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.SKU)
            .IsUnique();

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Name);

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Category);

        modelBuilder.Entity<ProductPrice>()
            .HasOne(pp => pp.Product)
            .WithMany(p => p.ProductPrices)
            .HasForeignKey(pp => pp.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Cart>()
            .HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Cart)
            .WithMany(c => c.CartItems)
            .HasForeignKey(ci => ci.CartId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.Cart)
            .WithOne(c => c.Order)
            .HasForeignKey<Order>(o => o.CartId);

        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Order)
            .WithOne(o => o.Payment)
            .HasForeignKey<Payment>(p => p.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        seedData(modelBuilder);
    }

    private void seedData(ModelBuilder modelBuilder)
    {
        var adminUser = new User
        {
            Id = 1,
            Username = "admin",
            Email = "admin@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = "Admin",
            CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };

        var regularUser = new User
        {
            Id = 2,
            Username = "user",
            Email = "user@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123"),
            Role = "User",
            CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        };
    
        modelBuilder.Entity<User>().HasData(adminUser, regularUser);
    
        var products = new[]
        {
            new Product
            {
                Id = 1,
                Name = "Wireless Mouse",
                Description = "Ergonomic wireless mouse with adjustable DPI.",
                SKU = "WM-001",
                Category = "Electronics",
                StockQuantity = 25,
                MinStockLevel = 10,
                CreatedByUserId = adminUser.Id,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            },
            new Product
            {
                Id = 2,
                Name = "Bluetooth Headphones",
                Description = "Noise-cancelling over-ear headphones with Bluetooth connectivity.",
                SKU = "BH-002",
                Category = "Electronics",
                StockQuantity = 15,
                MinStockLevel = 10,
                CreatedByUserId = adminUser.Id,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            },
        };
        modelBuilder.Entity<Product>().HasData(products);

        var prices = new List<ProductPrice>();
        var pirceId = 1;

        foreach (var product in products)
        {
            prices.Add(new ProductPrice
            {
                Id = pirceId++,
                ProductId = product.Id,
                Price = GetRegularPrice(product.Id),
                PriceType = PriceType.Regular,
                PriceLabel = "Harga Reguler",
                EffectiveDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            });

            prices.Add(new ProductPrice
            {
                Id = pirceId++,
                ProductId = product.Id,
                Price = 24.99m,
                PriceType = PriceType.Special,
                PriceLabel = "Harga Spesial",
                EffectiveDate = new DateTime(2024, 2, 1, 0, 0, 0, DateTimeKind.Utc),
                CreatedAt = new DateTime(2024, 2, 1, 0, 0, 0, DateTimeKind.Utc),
            });

            if (product.Id % 3 == 0)
            {
                prices.Add(new ProductPrice
                {
                    Id = pirceId++,
                    ProductId = product.Id,
                    Price = GetRegularPrice(product.Id) * 0.7m,
                    PriceType = PriceType.Promo,
                    PriceLabel = "Harga Promo",
                    EffectiveDate = DateTime.UtcNow.AddDays(-30),
                    ExpiryDate = DateTime.UtcNow.AddDays(30),
                    CreatedAt = DateTime.UtcNow.AddDays(-30),
                });
            }
        }
        modelBuilder.Entity<ProductPrice>().HasData(prices);
    }

    private decimal GetRegularPrice(int productId)
    {
        return productId switch
        {
            1 => 29.99m,
            2 => 59.99m,
            _ => 0m
        };
    }
}

namespace e_commerce_backend.DTOs;

public class ProductFilterDto
{
    public string? SearchTerm { get; set; }
    public string? Category { get; set; }
    public bool? IsActive { get; set; }
    public bool? LowStock { get; set; } 
    public string? SortBy { get; set; } = "Name"; 
    public bool SortDescending { get; set; } = false;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class PagedResponse<T>
{
    public List<T> Data { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPreviousPage => Page > 1 ;
    public bool HasNextPage => Page < TotalPages;
}


namespace Api.Dtos;



public class CategoryCreate
{
    public required string Name { get; set; }
    public string Description { get; set; } = string.Empty;
    public IFormFile? File { get; set; } = null!;
}
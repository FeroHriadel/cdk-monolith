namespace Api.Dtos;



public class CategoryUpdate
{
  public required int Id { get; set; }
    public string? Name { get; set; } = null!;
    public string? Description { get; set; } = string.Empty;
    public IFormFile? File { get; set; } = null!;
}
namespace Api.Dtos;



public class ItemCreate
{
  public required string Name { get; set; }
  public string? Description { get; set; } = "";
  public int? CategoryId { get; set; }
  public List<int> TagIds { get; set; } = new();
  public List<IFormFile> Images { get; set; } = new();
  public string? CreatedBy { get; set; }
}
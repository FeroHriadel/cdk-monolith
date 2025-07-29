namespace Api.Entities;



public class Category
{
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public string ImageUrl { get; set; } = string.Empty;


  // Navigation property for one-to-many relationship with Item
  public List<Item> Items { get; set; } = new();

  
  public required string CreatedBy { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
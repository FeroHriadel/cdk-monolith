namespace Api.Entities;



public class Tag
{
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;


  // Navigation property for many-to-many relationship with Item
  public List<Item> Items { get; set; } = new();


  public required string CreatedBy { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
namespace Api.Entities;



public class Item
{
  public int Id { get; set; }
  public required string Name { get; set; }
  public string? Description { get; set; } = "";


  //category (many-to-one)
  public int CategoryId { get; set; }
  public Category Category { get; set; } = null!; // navigation property


  // tags (many-to-many)
  public List<Tag> Tags { get; set; } = new();


  public string? Images { get; set; } = "[]"; // multiple images stored as a JSON array

  public required string CreatedBy { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

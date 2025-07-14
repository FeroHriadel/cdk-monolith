namespace Api.Entities;



public class Tag
{
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public required string CreatedBy { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
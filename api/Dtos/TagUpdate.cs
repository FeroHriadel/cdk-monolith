using System.ComponentModel.DataAnnotations;



namespace Api.Dtos;



public class TagUpdate
{
  [Required]
  [StringLength(20, MinimumLength = 1, ErrorMessage = "Tag must be between 1 and 20 characters.")]
  public string Name { get; set; } = string.Empty;
  public int Id { get; set; }
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

}
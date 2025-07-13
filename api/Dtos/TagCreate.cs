using System.ComponentModel.DataAnnotations;


namespace Api.Dtos;



public class TagCreate
{
  [Required]
  [StringLength(20, MinimumLength = 1, ErrorMessage = "Tag must be between 1 and 20 characters.")]
  public string Name { get; set; } = string.Empty;

}
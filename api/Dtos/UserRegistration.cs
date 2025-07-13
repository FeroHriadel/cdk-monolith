using System.ComponentModel.DataAnnotations;



namespace Api.Dtos;



public class UserRegistration
{
  [Required]
  [EmailAddress(ErrorMessage = "Invalid email address.")]
  public required string Email { get; set; }

  [Required]
  [StringLength(20, MinimumLength = 4, ErrorMessage = "Username must be between 4 and 20 characters.")]
  public required string UserName { get; set; }

  [Required]
  [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
  public required string Password { get; set; }
}
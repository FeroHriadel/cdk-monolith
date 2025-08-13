using System.ComponentModel.DataAnnotations;

namespace Api.Dtos;



public class UserLoginRequest
{
    [Required]
    public required string Email { get; set; }

    [Required]
    public required string Password { get; set; }

    [Required]
    public required string UserName { get; set; }
}
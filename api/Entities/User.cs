using Microsoft.AspNetCore.Identity;



namespace Api.Entities;



public class User: IdentityUser<int>
{
  //// All these are inherited by IdentityUser:
  // public int? Id { get; set; }
  // public required string Email { get; set; }
  // public required string UserName { get; set; }
  // public required byte[] PasswordHash { get; set; }
  // public required byte[] PasswordSalt { get; set; }

  public ICollection<UserRole> UserRoles { get; set; } = [];
  public DateTime LastActive { get; set; } = DateTime.UtcNow;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
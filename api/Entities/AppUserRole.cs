//links user and roles (provides foreign keys: UserId and RoleId)



using Microsoft.AspNetCore.Identity;



namespace Api.Entities;



public class UserRole : IdentityUserRole<int>
{
  public User User { get; set; } = null!;
  public Role Role { get; set; } = null!;
}
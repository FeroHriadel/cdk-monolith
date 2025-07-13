using Microsoft.AspNetCore.Identity;



namespace Api.Entities;



public class Role : IdentityRole<int>
{
    public ICollection<UserRole> UserRoles { get; set; } = [];
}

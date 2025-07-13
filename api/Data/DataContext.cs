// $ dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore --version 8.0.4
// $ dotnet ef database drop --force
// delete /api/Data/Migrations
// $ dotnet ef migrations add InitialCreate -o Data/Migrations
// $ dotnet ef database update



using Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;



namespace Api.Data;



public class DataContext(DbContextOptions options) : IdentityDbContext<
  User,
  Role,
  int,
  IdentityUserClaim<int>,
  UserRole,
  IdentityUserLogin<int>,
  IdentityRoleClaim<int>,
  IdentityUserToken<int>
>(options)
{
  public required DbSet<Tag> Tags { get; set; }

  // public required DbSet<User> Users { get; set; }   //not needed, inherited from IdentityDbContext

  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);
    builder.Entity<User>()
      .HasMany(ur => ur.UserRoles)
      .WithOne(u => u.User)
      .HasForeignKey(ur => ur.UserId)
      .IsRequired();
    builder.Entity<Role>()
      .HasMany(ur => ur.UserRoles)
      .WithOne(r => r.Role)
      .HasForeignKey(ur => ur.RoleId)
      .IsRequired();
    builder.Entity<Role>().HasData(
      new Role { Id = 1, Name = "User", NormalizedName = "USER" },
      new Role { Id = 2, Name = "Admin", NormalizedName = "ADMIN" }
    );
  }
}


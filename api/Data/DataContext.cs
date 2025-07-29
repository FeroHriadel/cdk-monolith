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
  // public required DbSet<User> Users { get; set; }   //not needed, inherited from IdentityDbContext

  public required DbSet<Tag> Tags { get; set; }
  public required DbSet<Category> Categories { get; set; }
  public required DbSet<Item> Items { get; set; }


  protected override void OnModelCreating(ModelBuilder builder)
  {
    base.OnModelCreating(builder);

    // UserRole many-to-many relationship
    builder.Entity<User>()
      .HasMany(ur => ur.UserRoles)
      .WithOne(u => u.User)
      .HasForeignKey(ur => ur.UserId)
      .IsRequired();

    // RoleUser many-to-many relationship
    builder.Entity<Role>()
      .HasMany(ur => ur.UserRoles)
      .WithOne(r => r.Role)
      .HasForeignKey(ur => ur.RoleId)
      .IsRequired();

    // Seed roles
    builder.Entity<Role>().HasData(
      new Role { Id = 1, Name = "User", NormalizedName = "USER" },
      new Role { Id = 2, Name = "Admin", NormalizedName = "ADMIN" }
    );

    // Item-Tag many-to-many
    builder.Entity<Item>()
      .HasMany(i => i.Tags)
      .WithMany(t => t.Items)
      .UsingEntity<Dictionary<string, object>>(
        "ItemTags",
        j => j
          .HasOne<Tag>()
          .WithMany()
          .HasForeignKey("TagId")
          .OnDelete(DeleteBehavior.Cascade), //remove from join table when Tag is deleted
        j => j
          .HasOne<Item>()
          .WithMany()
          .HasForeignKey("ItemId")
          .OnDelete(DeleteBehavior.Cascade)  //do the same when Item is deleted
      );

    // Item-Category many-to-one
    builder.Entity<Item>()
      .HasOne(i => i.Category)
      .WithMany(c => c.Items)
      .HasForeignKey(i => i.CategoryId)
      .OnDelete(DeleteBehavior.Restrict); //cannot delete Category if used by Item
  }
}


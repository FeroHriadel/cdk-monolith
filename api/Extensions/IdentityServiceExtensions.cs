using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Api.Entities;
using Microsoft.AspNetCore.Identity;
using Api.Data;



namespace API.Extensions;



public static class IdentityServiceExtensions
{
  public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
  {

    // Use EF Core for Identity
    services.AddIdentityCore<User>(opt => //password requirements
    {
      opt.Password.RequireNonAlphanumeric = false;
      opt.Password.RequiredLength = 6;
      opt.Password.RequireUppercase = false;
      opt.Password.RequireLowercase = false;
      opt.Password.RequireDigit = false;
    })
      .AddRoles<Role>() //add roles
      .AddRoleManager<RoleManager<Role>>()
      .AddEntityFrameworkStores<DataContext>(); //use dbContext


    // Configure Identity options
    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme) //use Bearer JWT for auth
    .AddJwtBearer(options =>
    {
      var tokenKey = config["TokenKey"] ?? throw new Exception("TokenKey is not configured.");
      options.TokenValidationParameters = new TokenValidationParameters
      {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(tokenKey)),
        ValidateIssuer = false,
        ValidateAudience = false
      };
    });


    // Configure Authorization roles
    services.AddAuthorizationBuilder()
    .AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"))
    .AddPolicy("RequireUserRole", policy => policy.RequireRole("User"));


    // Return the configured services
    return services;
  }
}
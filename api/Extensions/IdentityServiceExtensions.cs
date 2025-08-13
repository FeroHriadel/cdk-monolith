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
    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
      //use Bearer JWT for auth
      var tokenKey = config["TokenKey"] ?? throw new Exception("TokenKey is not configured.");
      options.TokenValidationParameters = new TokenValidationParameters
      {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(tokenKey)),
        ValidateIssuer = false,
        ValidateAudience = false
      };

      // take token from cookie (if you comment this out token will be read from Authorization header)
      options.Events = new JwtBearerEvents
      {
        OnMessageReceived = context =>
        {
          // read token from cookie
          var token = context.HttpContext.Request.Cookies["Authorization"];
          Console.WriteLine($"[JWT Cookie] Authorization={token}");
          if (!string.IsNullOrEmpty(token))
          {
            context.Token = token;
          }
          return Task.CompletedTask;
        }
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
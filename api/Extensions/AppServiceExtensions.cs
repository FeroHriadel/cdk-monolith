using Api.Data;
using Api.Interfaces;
using Api.Middleware;
using Api.Services;
using Microsoft.EntityFrameworkCore;



namespace Api.Extensions;



public static class AppServiceExtensions
{
  public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration configuration)
  {
    services.AddControllers();
    services.AddDbContext<DataContext>(options => options.UseMySQL(configuration.GetConnectionString("DefaultConnection")!));
    services.AddMemoryCache();
    services.AddScoped<ITagCacheService, TagCacheService>();
    services.AddCors();
    services.AddScoped<IUserRepository, UserRepository>();
    services.AddScoped<ITokenService, TokenService>();
    services.AddScoped<ITagRepository, TagRepository>();
    services.AddScoped<OnActionExecutionMiddleware>();
    services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
    return services;
  }

}
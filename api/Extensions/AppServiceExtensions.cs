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
    //controllers
    services.AddControllers();

    //db
    services.AddDbContext<DataContext>(options => options.UseMySQL(configuration.GetConnectionString("DefaultConnection")!));

    //cors
    services.AddCors();

    //cache
    services.AddMemoryCache();
    services.AddScoped<ITagCacheService, TagCacheService>();
    services.AddScoped<ICategoryCacheService, CategoryCacheService>();

    //services
    services.AddScoped<IUserRepository, UserRepository>();
    services.AddScoped<ITokenService, TokenService>();
    services.AddScoped<ITagRepository, TagRepository>();
    services.AddScoped<IImageService, ImageService>();
    services.AddScoped<ICategoryRepository, CategoryRepository>();
    services.AddScoped<IItemRepository, ItemRepository>();

    //filters
    services.AddScoped<OnActionExecutionMiddleware>();

    //mapping
    services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
    
    return services;
  }

}
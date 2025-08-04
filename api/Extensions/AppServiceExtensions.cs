using Api.Data;
using Api.Interfaces;
using Api.Middleware;
using Api.Services;
using Microsoft.EntityFrameworkCore;
using Api.Configuration;



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

    //queue
    services.Configure<RabbitMqSettings>(configuration.GetSection("RabbitMQ"));
    services.AddHostedService<QueueConsumer>();

    //services
    services.AddScoped<IUserRepository, UserRepository>();
    services.AddScoped<ITokenService, TokenService>();
    services.AddScoped<ITagRepository, TagRepository>();
    services.AddScoped<IImageService, ImageService>();
    services.AddScoped<ICategoryRepository, CategoryRepository>();
    services.AddScoped<IItemRepository, ItemRepository>();
    services.AddScoped<IQueueService, Queue>();

    //filters
    services.AddScoped<OnActionExecutionMiddleware>();

    //mapping
    services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
    
    return services;
  }

}
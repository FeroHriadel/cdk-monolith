using Api.Extensions;
using Api.Middleware;
using API.Extensions;
using Microsoft.Extensions.FileProviders;



var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAppServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(policy =>
  policy
  // .AllowAnyOrigin()
  .WithOrigins("http://localhost:4200")
  .AllowAnyMethod()
  .AllowAnyHeader()
  .AllowCredentials()
);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles(); // Serve static files from wwwroot
// Serve Angular app from wwwroot/browser
app.UseDefaultFiles(new DefaultFilesOptions {
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "browser")
    ),
    RequestPath = ""
});
app.UseStaticFiles(new StaticFileOptions
{
  FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "browser")
    ),
  RequestPath = ""
});
// Redirect all non-API, non-static requests to Angular index.html
app.Use(async (context, next) =>
{
    if (!context.Request.Path.StartsWithSegments("/api") &&
        !context.Request.Path.StartsWithSegments("/images") &&
        !Path.HasExtension(context.Request.Path.Value))
    {
        context.Request.Path = "/index.html";
    }
    await next();
});
app.Run();
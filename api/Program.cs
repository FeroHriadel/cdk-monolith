using Api.Extensions;
using Api.Middleware;
using API.Extensions;
using Microsoft.Extensions.FileProviders;



// init app builder
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAppServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

// init app
var app = builder.Build();

// middleware
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(policy =>
  policy
  .WithOrigins("http://localhost:4200")
  .AllowAnyMethod()
  .AllowAnyHeader()
  .AllowCredentials()
);
app.UseAuthentication();
app.UseAuthorization();

// Static Files - Correct order: UseDefaultFiles BEFORE UseStaticFiles
app.UseDefaultFiles(new DefaultFilesOptions { // Maps "/" to "wwwroot/browser/index.html"
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "browser")
    ),
    RequestPath = ""
});
app.UseStaticFiles(); // Default wwwroot static files (images...)

app.UseStaticFiles(new StaticFileOptions // Serve Angular app from wwwroot/browser
{
  FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "browser")
    ),
  RequestPath = ""
});

// Api routes
app.MapControllers();

// SPA Fallback - Must be last - serves Angular app for unmatched routes
app.MapFallbackToFile("/browser/index.html");

app.Run();
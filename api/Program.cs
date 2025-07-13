using Api.Extensions;
using Api.Middleware;
using API.Extensions;



var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAppServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
using Microsoft.AspNetCore.Mvc.Filters;
using Api.Interfaces;



namespace Api.Middleware;



public class OnActionExecutionMiddleware : IAsyncActionFilter
{
  public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
  {
    var resultContext = await next();
    if (context?.HttpContext?.User?.Identity?.IsAuthenticated != true) return;
    var email = context.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
    if (string.IsNullOrEmpty(email)) return;
    var repo = context.HttpContext.RequestServices.GetService<IUserRepository>();
    if (repo == null) return;
    var user = await repo.GetUserByEmailAsync(email);
    if (user == null) return;
    user.LastActive = DateTime.UtcNow;
    await repo.UpdateUserAsync(user);
  }
}
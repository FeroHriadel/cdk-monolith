using Microsoft.AspNetCore.Mvc;
using Api.Middleware;



namespace Api.Controllers;



[ServiceFilter(typeof(OnActionExecutionMiddleware))]
[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    // This class can be used to define common functionality for all API controllers
    // For example, you can add common methods, properties, or filters here that all API controllers will inherit.
}

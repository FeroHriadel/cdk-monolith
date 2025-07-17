using Microsoft.AspNetCore.Mvc;
using Api.Middleware;
using Api.Dtos;



namespace Api.Controllers;



[ServiceFilter(typeof(OnActionExecutionMiddleware))]
[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{

    // STANDARDIZED API RESPONSES

    protected ActionResult<ApiResponse<T>> Success<T>(int statusCode, string message, T data = default)
    {
        var result = new ApiResponse<T>(statusCode, message, data);
        return Ok(result);
    }

    protected ActionResult<ApiResponse<T>> Error<T>(int statusCode, string message)
    {
        var result = new ApiResponse<T>(statusCode, message);
        return StatusCode(statusCode, result);
    }

}

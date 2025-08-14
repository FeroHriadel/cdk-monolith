using System.Security.Claims;
using Api.Entities;



namespace Api.Interfaces;



public interface ITokenService
{
    Task<string> CreateTokenAsync(User user);
    Task<User?> GetUserFromTokenAsync(string token);
    void SetTokenAsCookieAsync(string token, HttpContext httpContext);
    string GetEmailFromClaims(ClaimsPrincipal user);
}
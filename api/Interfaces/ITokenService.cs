using System.Security.Claims;
using Api.Entities;



namespace Api.Interfaces;



public interface ITokenService
{
    Task<string> CreateTokenAsync(User user);

    string GetEmailFromClaims(ClaimsPrincipal user);
}
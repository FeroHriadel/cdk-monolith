using Api.Entities;



namespace Api.Interfaces;



public interface ITokenService
{
    Task<string> CreateTokenAsync(User user);
}
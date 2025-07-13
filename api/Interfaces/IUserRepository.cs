using Api.Entities;



namespace Api.Interfaces;



public interface IUserRepository
{
  Task<User?> GetUserByEmailAsync(string email);
  Task<User> UpdateUserAsync(User user);
}
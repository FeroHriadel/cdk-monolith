using Microsoft.EntityFrameworkCore;
using Api.Dtos;
using Api.Entities;
using Api.Interfaces;



namespace Api.Data;



public class UserRepository(DataContext context) : IUserRepository
{

  // GET USER BY EMAIL
  public async Task<User?> GetUserByEmailAsync(string email)
  {
    return await context.Users.FirstOrDefaultAsync(u => u.Email == email);
  }

  // UPDATE USER
  public async Task<User> UpdateUserAsync(User user)
  {
    context.Users.Update(user);
    await context.SaveChangesAsync();
    return user;
  }
}
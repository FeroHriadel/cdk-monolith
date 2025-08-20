using Api.Entities;
using Api.Dtos;
using System.Security.Claims;



namespace Api.Interfaces;



public interface ICategoryRepository
{
    Task<Category> CreateAsync(CategoryCreate categoryCreateDto, ClaimsPrincipal user);
    Task<Category?> GetByIdAsync(int id);
    Task<IEnumerable<Category>> GetAllAsync();
    Task<Category?> UpdateAsync(CategoryUpdate categoryUpdateDto);
    Task<Category> DeleteAsync(int id);
    Task<bool> HasItemsAsync(int categoryId);
}
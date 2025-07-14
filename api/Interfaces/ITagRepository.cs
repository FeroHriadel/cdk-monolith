using Api.Entities;
using Api.Dtos;
using System.Security.Claims;



namespace Api.Interfaces;



public interface ITagRepository
{
  Task<Tag> CreateAsync(TagCreate tagCreateDto, ClaimsPrincipal user);
  Task<IEnumerable<Tag>> GetAllAsync();
  Task<Tag?> GetByIdAsync(int id);
  Task<Tag?> UpdateAsync(TagUpdate tagUpdateDto);
  Task<int> DeleteAsync(int id);
}
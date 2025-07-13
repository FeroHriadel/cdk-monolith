using Api.Entities;
using Api.Dtos;



namespace Api.Interfaces;



public interface ITagRepository
{
  Task<Tag> CreateAsync(TagCreate tagCreateDto);
  Task<IEnumerable<Tag>> GetAllAsync();
}
using Microsoft.EntityFrameworkCore;
using Api.Dtos;
using Api.Entities;
using Api.Interfaces;



namespace Api.Data;



public class TagRepository(DataContext context) : ITagRepository
{

  // CREATE TAG
  public async Task<Tag> CreateAsync(TagCreate tagCreateDto)
  {
    var tag = new Tag { Name = tagCreateDto.Name };
    context.Tags.Add(tag);
    await context.SaveChangesAsync();
    return tag;
  }


  // GET ALL TAGS
  public async Task<IEnumerable<Tag>> GetAllAsync()
  {
    return await context.Tags.ToListAsync();
  }
}
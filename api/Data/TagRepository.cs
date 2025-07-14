using Microsoft.EntityFrameworkCore;
using Api.Dtos;
using Api.Entities;
using Api.Interfaces;
using System.Security.Claims;



namespace Api.Data;



public class TagRepository(DataContext context, ITokenService tokenService) : ITagRepository
{

  // CREATE TAG
  public async Task<Tag> CreateAsync(TagCreate tagCreateDto, ClaimsPrincipal user)
  {
    if (tagCreateDto == null || tagCreateDto.Name.Length < 1) throw new InvalidOperationException("Tag name must be between 1 and 20 characters.");
    var tag = new Tag
    {
      Name = tagCreateDto.Name,
      CreatedBy = tokenService.GetEmailFromClaims(user) ?? throw new InvalidOperationException("User email not found"),
      CreatedAt = DateTime.UtcNow,
      UpdatedAt = DateTime.UtcNow
    };
    context.Tags.Add(tag);
    await context.SaveChangesAsync();
    return tag;
  }


  // GET ALL TAGS
  public async Task<IEnumerable<Tag>> GetAllAsync()
  {
    return await context.Tags.ToListAsync();
  }


  // GET TAG BY ID
  public async Task<Tag?> GetByIdAsync(int id)
  {
    return await context.Tags.FindAsync(id);
  }


  // UPDATE TAG
  public async Task<Tag?> UpdateAsync(TagUpdate tagUpdateDto)
  {
    // get tag
    var tag = await context.Tags.FindAsync(tagUpdateDto.Id);
    if (tag == null) return null;

    // update tag
    tag.UpdatedAt = DateTime.UtcNow;
    tag.Name = tagUpdateDto.Name;

    context.Tags.Update(tag);
    await context.SaveChangesAsync();
    return tag;
  }


  // DELETE TAG
  public async Task<int> DeleteAsync(int id)
  {
    var tag = await context.Tags.FindAsync(id);
    if (tag == null) throw new InvalidOperationException("Tag not found");
    context.Tags.Remove(tag);
    await context.SaveChangesAsync();
    return id;
  }
}
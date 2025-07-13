using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Api.Interfaces;
using Api.Dtos;
using Api.Entities;



namespace Api.Controllers;



[Authorize]
public class TagsController(ITagRepository tagRepository) : BaseApiController
{
  // CREATE TAG (POST /api/tags)
  [AllowAnonymous]
  [HttpPost]
  public async Task<ActionResult<Tag>> CreateTag(TagCreate tagCreateDto)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);
    var tag = await tagRepository.CreateAsync(tagCreateDto);
    return CreatedAtAction(nameof(GetAllTags), new { id = tag.Id }, tag);
  }

  // GET ALL TAGS (GET /api/tags)
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tag>>> GetAllTags()
    {
        var tags = await tagRepository.GetAllAsync();
        return Ok(tags);
    }
}

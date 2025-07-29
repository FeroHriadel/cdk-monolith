using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Api.Interfaces;
using Api.Dtos;
using Api.Entities;



namespace Api.Controllers;



[Authorize]
public class TagsController(ITagRepository tagRepository, ITokenService tokenService, ITagCacheService tagCache) : BaseApiController
{

  // CREATE TAG (POST /api/tags)
  [HttpPost]
  public async Task<ActionResult<ApiResponse<Tag>>> CreateTag(TagCreate tagCreateDto)
  {
    // validate model state & unique name
    if (string.IsNullOrWhiteSpace(tagCreateDto.Name)) return Error<Tag>(400, "Tag name is required");
    if (!ModelState.IsValid) return Error<Tag>(400, "Invalid model state");
    var existingTag = await tagRepository.GetByNameAsync(tagCreateDto.Name);
    if (existingTag != null) return Error<Tag>(400, "Tag with this name already exists");

    // save tag to db
    tagCreateDto.CreatedBy = tokenService.GetEmailFromClaims(User)!;
    var tag = await tagRepository.CreateAsync(tagCreateDto, User);

    // update cache
    var cachedTags = await tagCache.GetTagsAsync();
    if (cachedTags != null && cachedTags.Any())
    {
      var updatedTags = cachedTags.Append(tag);
      await tagCache.UpdateTagsAsync(updatedTags);
    }
    else
    {
      await tagCache.UpdateTagsAsync(new List<Tag> { tag });
    }

    // respond
    return Success(201, "Tag created", tag);
  }


  // GET ALL TAGS (GET /api/tags)
  [AllowAnonymous]
  [HttpGet]
  public async Task<ActionResult<ApiResponse<IEnumerable<Tag>>>> GetAllTags()
  {
    // Check cache first
    var cachedTags = await tagCache.GetTagsAsync();
    if (cachedTags != null && cachedTags.Any()) return Success(200, "Tags fetched from cache", cachedTags);

    // If cache is empty, fetch from db & store in cache
    var tags = await tagRepository.GetAllAsync();
    await tagCache.UpdateTagsAsync(tags);
    return Success(200, "Tags fetched", tags);
  }


  // GET TAG BY ID (GET /api/tags/{id})
  [AllowAnonymous]
  [HttpGet("{id:int}")]
  public async Task<ActionResult<ApiResponse<Tag>>> GetTagById(int id)
  {
    var tag = await tagRepository.GetByIdAsync(id);
    if (tag == null) return Error<Tag>(404, "Tag not found");
    return Success(200, "Tag found", tag);
  }


  // UPDATE TAG (PUT /api/tags/{id})
  [Authorize(Roles = "Admin")]
  [HttpPut]
  public async Task<ActionResult<ApiResponse<Tag>>> UpdateTag([FromBody] TagUpdate tagUpdateDto)
  {
    // validate model state & unique name
    if (!ModelState.IsValid) return Error<Tag>(400, "Invalid model state");
    if (string.IsNullOrWhiteSpace(tagUpdateDto.Name)) return Error<Tag>(400, "Tag name is required");
    var existingTag = await tagRepository.GetByNameAsync(tagUpdateDto.Name);
    if (existingTag != null && existingTag.Id != tagUpdateDto.Id) return Error<Tag>(400, "Tag with this name already exists");

    // update tag in db
    var tag = await tagRepository.UpdateAsync(tagUpdateDto);
    if (tag == null) return Error<Tag>(404, "Tag not found");

    // update cache
    await tagCache.InvalidateCacheAsync();
    var cachedTags = await tagCache.GetTagsAsync();
    if (cachedTags != null && cachedTags.Any())
    {
      var updatedTags = cachedTags.Select(t => t.Id == tag.Id ? tag : t);
      await tagCache.UpdateTagsAsync(updatedTags);
    }
    else
    {
      await tagCache.UpdateTagsAsync(new List<Tag> { tag });
    }

    //respond
    return Success(200, "Tag updated", tag);
  }


  // DELETE TAG (DELETE /api/tags/{id})
  [Authorize(Roles = "Admin")]
  [HttpDelete("{id:int}")]
  public async Task<ActionResult<ApiResponse<int>>> DeleteTag(int id)
  {
    // validate id
    if (id <= 0) return Error<int>(400, "Invalid tag ID");

    // delete tag from db
    var deletedTagId = await tagRepository.DeleteAsync(id);

    // update cache
    await tagCache.InvalidateCacheAsync();
    var cachedTags = await tagCache.GetTagsAsync();
    if (cachedTags != null && cachedTags.Any())
    {
      var updatedTags = cachedTags.Where(t => t.Id != deletedTagId);
      await tagCache.UpdateTagsAsync(updatedTags);
    }
    else
    {
      await tagCache.UpdateTagsAsync(new List<Tag>());
    }

    // respond
    return Success(200, "Tag deleted", deletedTagId);
  }

}

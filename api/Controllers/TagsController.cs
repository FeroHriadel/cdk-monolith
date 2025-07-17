using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Api.Interfaces;
using Api.Dtos;
using Api.Entities;

namespace Api.Controllers;

[Authorize]
public class TagsController(ITagRepository tagRepository, ITokenService tokenService) : BaseApiController
{

  // CREATE TAG (POST /api/tags)
  [HttpPost]
  public async Task<ActionResult<ApiResponse<Tag>>> CreateTag(TagCreate tagCreateDto)
  {
    if (!ModelState.IsValid)
      return Error<Tag>(400, "Invalid model state");

    tagCreateDto.CreatedBy = tokenService.GetEmailFromClaims(User)!;
    var tag = await tagRepository.CreateAsync(tagCreateDto, User);

    return Success(201, "Tag created", tag);
  }


  // GET ALL TAGS (GET /api/tags)
  [AllowAnonymous]
  [HttpGet]
  public async Task<ActionResult<ApiResponse<IEnumerable<Tag>>>> GetAllTags()
  {
    var tags = await tagRepository.GetAllAsync();
    return Success(200, "Tags fetched", tags);
  }


  // GET TAG BY ID (GET /api/tags/{id})
  [AllowAnonymous]
  [HttpGet("{id:int}")]
  public async Task<ActionResult<ApiResponse<Tag>>> GetTagById(int id)
  {
    var tag = await tagRepository.GetByIdAsync(id);
    if (tag == null)
      return Error<Tag>(404, "Tag not found");

    return Success(200, "Tag found", tag);
  }


  // UPDATE TAG (PUT /api/tags/{id})
  [Authorize(Roles = "Admin")]
  [HttpPut]
  public async Task<ActionResult<ApiResponse<Tag>>> UpdateTag([FromBody] TagUpdate tagUpdateDto)
  {
    if (!ModelState.IsValid)
      return Error<Tag>(400, "Invalid model state");

    var tag = await tagRepository.UpdateAsync(tagUpdateDto);
    if (tag == null)
      return Error<Tag>(404, "Tag not found");

    return Success(200, "Tag updated", tag);
  }


  // DELETE TAG (DELETE /api/tags/{id})
  [Authorize(Roles = "Admin")]
  [HttpDelete("{id:int}")]
  public async Task<ActionResult<ApiResponse<int>>> DeleteTag(int id)
  {
    if (id <= 0)
      return Error<int>(400, "Invalid tag ID");

    var deletedTagId = await tagRepository.DeleteAsync(id);
    return Success(200, "Tag deleted", deletedTagId);
  }
    
}

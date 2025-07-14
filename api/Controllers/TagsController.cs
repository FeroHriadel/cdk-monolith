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
  public async Task<ActionResult<Tag>> CreateTag(TagCreate tagCreateDto)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);
    tagCreateDto.CreatedBy = tokenService.GetEmailFromClaims(User)!;
    var tag = await tagRepository.CreateAsync(tagCreateDto, User);
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


  // GET TAG BY ID (GET /api/tags/{id})
  [AllowAnonymous]
  [HttpGet("{id:int}")]
  public async Task<ActionResult<Tag>> GetTagById(int id)
  {
    var tag = await tagRepository.GetByIdAsync(id);
    if (tag == null) return NotFound("Tag not found");
    return Ok(tag);
  }


  // UPDATE TAG (PUT /api/tags/{id})
  [Authorize(Roles = "Admin")]
  [HttpPut]
  public async Task<ActionResult<Tag>> UpdateTag([FromBody] TagUpdate tagUpdateDto)
  {
    if (!ModelState.IsValid) return BadRequest(ModelState);
    var tag = await tagRepository.UpdateAsync(tagUpdateDto);
    if (tag == null) return NotFound("Tag not found");
    return Ok(tag);
  }


  // DELETE TAG (DELETE /api/tags/{id})
  [Authorize(Roles = "Admin")]
  [HttpDelete("{id:int}")]
  public async Task<ActionResult<int>> DeleteTag(int id)
  {
    if (id <= 0) return BadRequest("Invalid tag ID");
    var deletedTagId = await tagRepository.DeleteAsync(id);
    return Ok(deletedTagId);
  }

}

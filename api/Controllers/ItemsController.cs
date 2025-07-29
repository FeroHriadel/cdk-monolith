using Api.Interfaces;
using Api.Dtos;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ZstdSharp;



namespace Api.Controllers;



[Authorize]
public class ItemsController(IItemRepository itemRepository, ITokenService tokenService, IMapper mapper) : BaseApiController
{
  // POST api/items
  [HttpPost]
  public async Task<ActionResult<ApiResponse<ItemResponse>>> CreateItem([FromForm] ItemCreate itemCreateDto)
  {
    if (itemCreateDto == null) return BadRequest("Item data is required.");
    itemCreateDto.CreatedBy = tokenService.GetEmailFromClaims(User)!;
    var createdItem = await itemRepository.CreateItemAsync(itemCreateDto);
    var itemResponse = mapper.Map<ItemResponse>(createdItem);
    return Success(201, "Item created successfully", itemResponse);
  }


  // GET api/items/{id}
  [AllowAnonymous]
  [HttpGet("{id:int}")]
  public async Task<ActionResult<ApiResponse<ItemResponse>>> GetItem(int id)
  {
    var item = await itemRepository.GetItemByIdAsync(id);
    if (item == null) return NotFound("Item not found.");
    var itemResponse = mapper.Map<ItemResponse>(item);
    return Success(200, "Item retrieved successfully", itemResponse);
  }


  // GET api/items
  [AllowAnonymous]
  [HttpGet]
  public async Task<ActionResult<ApiResponse<List<ItemResponse>>>> GetItems([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
  {
    var items = await itemRepository.GetItemsAsync(pageNumber, pageSize);
    var itemResponses = mapper.Map<List<ItemResponse>>(items);
    return Success(200, "Items retrieved successfully", itemResponses);
  }

  // PUT api/items/{id}
  [HttpPut("{id:int}")]
  public async Task<ActionResult<ApiResponse<ItemResponse>>> UpdateItem(int id, [FromForm] ItemUpdate itemUpdateDto)
  {
    // checks
    if (itemUpdateDto == null) return BadRequest("Item data is required.");
    var item = await itemRepository.GetItemByIdAsync(id);
    if (item == null) return NotFound("Item not found.");

    // only admin and author can update
    if (!User.IsInRole("Admin") && tokenService.GetEmailFromClaims(User) != item.CreatedBy) return Forbid("You do not have permission to update this item.");

    // update item
    var updatedItem = await itemRepository.UpdateItemAsync(id, itemUpdateDto);
    if (updatedItem == null) return NotFound("Item not found.");
    var itemResponse = mapper.Map<ItemResponse>(updatedItem);
    return Success(200, "Item updated successfully", itemResponse);
  }


  // DELETE api/items/{id}
  [HttpDelete("{id:int}")]
  public async Task<ActionResult<ApiResponse<bool>>> DeleteItem(int id)
  {
    // checks
    var item = await itemRepository.GetItemByIdAsync(id);
    if (item == null) throw new KeyNotFoundException("Item not found.");

    // only admin and author can delete
    if (!User.IsInRole("Admin") && tokenService.GetEmailFromClaims(User) != item.CreatedBy) return Forbid("You do not have permission to delete this item.");

    var result = await itemRepository.DeleteItemAsync(id);
    if (!result) return NotFound("Item not found.");
    return Success(204, "Item deleted successfully", true);
  }
}
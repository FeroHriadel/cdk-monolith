using Api.Interfaces;
using Api.Entities;
using Api.Dtos;
using Microsoft.EntityFrameworkCore;



namespace Api.Data;


public class ItemRepository(DataContext context, IImageService imageService) : IItemRepository
{

  // CREATE ITEM
  public async Task<Item> CreateItemAsync(ItemCreate itemCreateDto)
  {
    // get Tags from the database
    var tags = await context.Tags
      .Where(t => itemCreateDto.TagIds.Contains(t.Id))
      .ToListAsync();

    // get Category from the database
    var category = await context.Categories.FirstOrDefaultAsync(c => c.Id == itemCreateDto.CategoryId) ?? throw new ArgumentException("Category not found");

    // create a new item entity from the DTO
    var item = new Item
    {
      Name = itemCreateDto.Name,
      Description = itemCreateDto.Description,
      CategoryId = itemCreateDto.CategoryId ?? 0,
      Tags = tags,
      CreatedBy = itemCreateDto.CreatedBy!,
      CreatedAt = DateTime.UtcNow,
      UpdatedAt = DateTime.UtcNow
    };

    // handle image uploads
    if (itemCreateDto.Images != null && itemCreateDto.Images.Count > 0)
    {
      var imageUrls = new List<string>();
      foreach (var image in itemCreateDto.Images)
      {
        var imageUrl = await imageService.UploadImageAsync(image);
        imageUrls.Add(imageUrl);
      }
      item.Images = System.Text.Json.JsonSerializer.Serialize(imageUrls);
    }

    // save and return the item
    context.Items.Add(item);
    await context.SaveChangesAsync();
    return item;
  }


  // GET ITEM BY ID
  public async Task<Item?> GetItemByIdAsync(int id)
  {
    // fetch the item with its related data
    return await context.Items
      .Include(i => i.Category)
      .Include(i => i.Tags)
      .FirstOrDefaultAsync(i => i.Id == id);
  }


  // GET ITEMS WITH PAGINATION
  public async Task<List<Item>> GetItemsAsync(int pageNumber, int pageSize, int? categoryId = null, int? tagId = null, string? searchTerm = null)
  {
    // calculate the skip count for pagination
    var skip = (pageNumber - 1) * pageSize;

    // build the query
    var query = context.Items
      .Include(i => i.Category)
      .Include(i => i.Tags)
      .AsQueryable();

    // apply filters
    if (categoryId.HasValue) query = query.Where(i => i.CategoryId == categoryId.Value);
    if (tagId.HasValue) query = query.Where(i => i.Tags.Any(t => t.Id == tagId.Value));
    if (!string.IsNullOrEmpty(searchTerm)) query = query.Where(i => i.Name.Contains(searchTerm) || (i.Description != null && i.Description.Contains(searchTerm)));

    // apply pagination
    return await query.Skip(skip).Take(pageSize).ToListAsync();
  }


  // UPDATE ITEM
  public async Task<Item?> UpdateItemAsync(int id, ItemUpdate itemUpdateDto)
  {
    // get item
    var item = await context.Items.FindAsync(id);
    if (item == null) throw new KeyNotFoundException("Item not found");

    // update item Name, Descrition, CategoryId, updatedAt
    item.Name = itemUpdateDto.Name ?? item.Name;
    item.Description = itemUpdateDto.Description ?? item.Description;
    item.CategoryId = itemUpdateDto.CategoryId ?? item.CategoryId;
    item.UpdatedAt = DateTime.UtcNow;

    // update Tags
    if (itemUpdateDto.TagIds != null)
    {
      var tags = await context.Tags
        .Where(t => itemUpdateDto.TagIds.Contains(t.Id))
        .ToListAsync();
      item.Tags = tags;
    }

    // handle image updates
    if (itemUpdateDto.Images != null && itemUpdateDto.Images.Count > 0)
    {
      // deserialize old image URLs
      var oldImageUrls = item.Images != null
        ? System.Text.Json.JsonSerializer.Deserialize<List<string>>(item.Images, default(System.Text.Json.JsonSerializerOptions)) ?? new List<string>()
        : new List<string>();
      var imageUrls = new List<string>();

      // upload new images
      foreach (var image in itemUpdateDto.Images)
      {
        var imageUrl = await imageService.UploadImageAsync(image);
        imageUrls.Add(imageUrl);
      }
      item.Images = System.Text.Json.JsonSerializer.Serialize(imageUrls);

      // delete old images
      foreach (var oldImageUrl in oldImageUrls)
      {
        await imageService.DeleteImageAsync(oldImageUrl);
      }
    }

    // save changes
    await context.SaveChangesAsync();
    return item;
  }


  // DELETE ITEM
  public async Task<bool> DeleteItemAsync(int id)
  {
    // get item
    var item = await context.Items.FindAsync(id);
    if (item == null) return false;

    // delete images
    if (item.Images != null)
    {
      var imageUrls = System.Text.Json.JsonSerializer.Deserialize<List<string>>(item.Images, default(System.Text.Json.JsonSerializerOptions)) ?? new List<string>();
      foreach (var imageUrl in imageUrls)
      {
        await imageService.DeleteImageAsync(imageUrl);
      }
    }

    // remove item from context
    context.Items.Remove(item);
    await context.SaveChangesAsync();
    return true;
  }
}
using Api.Entities;
using Api.Dtos;



namespace Api.Interfaces;



public interface IItemRepository
{
  Task<Item> CreateItemAsync(ItemCreate itemCreate);
  Task<Item?> GetItemByIdAsync(int id);
  Task<List<Item>> GetItemsAsync(int pageNumber, int pageSize, int? categoryId = null, int? tagId = null, string? searchTerm = null);
  Task<Item?> UpdateItemAsync(int id, ItemUpdate itemUpdateDto);
  Task<bool> DeleteItemAsync(int id);
}
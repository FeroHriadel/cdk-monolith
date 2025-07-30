using Api.Entities;


public interface ICategoryCacheService
{
    Task<IEnumerable<Category>> GetCategoriesAsync();
    Task UpdateCategoriesAsync(IEnumerable<Category> categories);
    Task InvalidateCacheAsync();
}
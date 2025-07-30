using Microsoft.Extensions.Caching.Memory;
using Api.Entities;



public class CategoryCacheService : ICategoryCacheService
{
  private readonly IMemoryCache _cache;
  private const string CategoriesCacheKey = "categories_cache";
  private readonly TimeSpan _cacheDuration = TimeSpan.FromMinutes(30);


  public CategoryCacheService(IMemoryCache cache)
  {
    _cache = cache;
  }


  public Task<IEnumerable<Category>> GetCategoriesAsync()
  {
    _cache.TryGetValue(CategoriesCacheKey, out IEnumerable<Category>? categories);
    return Task.FromResult(categories ?? Enumerable.Empty<Category>());
  }

  public Task UpdateCategoriesAsync(IEnumerable<Category> categories)
  {
    _cache.Set(CategoriesCacheKey, categories, _cacheDuration);
    return Task.CompletedTask;
  }

  public Task InvalidateCacheAsync()
  {
    _cache.Remove(CategoriesCacheKey);
    return Task.CompletedTask;
  }

}
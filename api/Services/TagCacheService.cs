using Microsoft.Extensions.Caching.Memory;
using Api.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;


public class TagCacheService : ITagCacheService
{
    private readonly IMemoryCache _cache;
    private const string TagsCacheKey = "tags_cache";
    private readonly TimeSpan _cacheDuration = TimeSpan.FromMinutes(30);

    public TagCacheService(IMemoryCache cache)
    {
      _cache = cache;
    }

    public Task<IEnumerable<Tag>> GetTagsAsync()
    {
      _cache.TryGetValue(TagsCacheKey, out IEnumerable<Tag> tags);
      return Task.FromResult(tags);
    }

    public Task UpdateTagsAsync(IEnumerable<Tag> tags)
    {
      _cache.Set(TagsCacheKey, tags, _cacheDuration);
      return Task.CompletedTask;
    }

    public Task InvalidateCacheAsync()
    {
      _cache.Remove(TagsCacheKey);
      return Task.CompletedTask;
    }
}
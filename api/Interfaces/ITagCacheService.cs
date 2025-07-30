using Api.Entities;


public interface ITagCacheService
{
    Task<IEnumerable<Tag>> GetTagsAsync();
    Task UpdateTagsAsync(IEnumerable<Tag> tags);
    Task InvalidateCacheAsync();
}
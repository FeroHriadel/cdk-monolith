using Api.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ITagCacheService
{
    Task<IEnumerable<Tag>> GetTagsAsync();
    Task UpdateTagsAsync(IEnumerable<Tag> tags);
    Task InvalidateCacheAsync();
}
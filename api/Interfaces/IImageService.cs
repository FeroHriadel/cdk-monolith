namespace Api.Interfaces;



public interface IImageService
{
  public Task<string> UploadImageAsync(IFormFile file);

  public Task<string> DeleteImageAsync(string imageUrl);
}
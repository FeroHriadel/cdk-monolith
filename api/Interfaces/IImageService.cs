namespace Api.Interfaces;



public interface IImageService
{
  public Task<string> UploadImageAsync(IFormFile file);
  public Task<List<string>> UploadImagesAsync(List<IFormFile> files);

  public Task<string> DeleteImageAsync(string imageUrl);
}
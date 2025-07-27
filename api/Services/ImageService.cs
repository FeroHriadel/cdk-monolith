using Api.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;


namespace Api.Services;



public class ImageService : IImageService
{

  // UPLOAD IMAGE and return url
  public async Task<string> UploadImageAsync(IFormFile file)
  {
    var imageUrl = "";
    if (file == null || file.Length == 0) return imageUrl;
    if (!IsValidImageType(file)) throw new InvalidOperationException("Invalid file type. Allowed types are: image/jpeg, image/jpg, image/png, image/gif, image/webp");
    var resizedImage = await ResizeImageAsync(file);
    var uniqueFileName = GenerateUniqueFileName(file);
    imageUrl = await SaveImageAsync(resizedImage, uniqueFileName);
    return imageUrl;
  }


  // DELETE IMAGE by ImageUrl
  public async Task<string> DeleteImageAsync(string imageUrl)
  {
    if (string.IsNullOrEmpty(imageUrl)) return string.Empty;
    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imageUrl.TrimStart('/'));
    if (File.Exists(filePath)) File.Delete(filePath);
    return string.Empty;
  }


  // HELPER - Validate file type
  private bool IsValidImageType(IFormFile file)
  {
    var allowedExtensions = new[] { ".jpeg", ".jpg", ".png", ".gif", ".webp" };
    var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
    if (!allowedExtensions.Contains(fileExtension)) return false;
    return true;
  }


  // HELPER - Resize image to 500x500
  private async Task<Image> ResizeImageAsync(IFormFile file)
  {
    using var stream = file?.OpenReadStream();
    var image = await Image.LoadAsync(stream!);
    var resizedImage = image.Clone(ctx =>
      ctx.Resize(new ResizeOptions
      {
        Size = new Size(500, 500),
        Mode = ResizeMode.Crop,
        Position = AnchorPositionMode.Center
      }));
    return resizedImage;
  }


  // HELPER - Generate unique file name
  private string GenerateUniqueFileName(IFormFile file)
  {
    var originalName = Path.GetFileNameWithoutExtension(file.FileName);
    var extension = Path.GetExtension(file.FileName);
    var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
    return $"{originalName}-{timestamp}{extension}";
  }


  // HELPER - Save image to wwwroot/images and return URL
  private async Task<string> SaveImageAsync(Image image, string uniqueFileName)
  {
    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
    var filePath = Path.Combine(uploadsFolder, uniqueFileName);
    await image.SaveAsync(filePath);
    return $"/images/{uniqueFileName}";
  }

}
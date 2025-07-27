using Microsoft.EntityFrameworkCore;
using Api.Dtos;
using Api.Entities;
using Api.Interfaces;
using System.Security.Claims;




namespace Api.Data;



public class CategoryRepository(DataContext context, ITokenService tokenService, IImageService imageService) : ICategoryRepository
{

  // CREATE CATEGORY
  public async Task<Category> CreateAsync(CategoryCreate categoryCreateDto, ClaimsPrincipal user)
  {
    if (!IsCategoryNameUniqueAsync(categoryCreateDto.Name).Result) throw new InvalidOperationException("Category name must be unique.");
    var imageUrl = await imageService.UploadImageAsync(categoryCreateDto.File!);
    var category = new Category
    {
      Name = categoryCreateDto.Name,
      Description = categoryCreateDto.Description,
      ImageUrl = imageUrl,
      CreatedBy = tokenService.GetEmailFromClaims(user) ?? throw new InvalidOperationException("User email not found"),
      CreatedAt = DateTime.UtcNow,
      UpdatedAt = DateTime.UtcNow
    };
    context.Categories.Add(category);
    await context.SaveChangesAsync();
    return category;
  }


  // GET CATEGORY BY ID
  public async Task<Category?> GetByIdAsync(int id)
  {
    return await context.Categories.FindAsync(id);
  }


  // GET ALL CATEGORIES
  public async Task<IEnumerable<Category>> GetAllAsync()
  {
    return await context.Categories.ToListAsync();
  }


  // UPDATE CATEGORY
  public async Task<Category?> UpdateAsync(CategoryUpdate categoryUpdateDto)
  {
    var category = await GetCategory(categoryUpdateDto.Id);
    category = await UpdateCategoryNameAsync(category, categoryUpdateDto.Name!);
    category = await UpdateCategoryImageAsync(category, categoryUpdateDto.File);
    category.Description = categoryUpdateDto.Description ?? category.Description ?? string.Empty;
    category.UpdatedAt = DateTime.UtcNow;
    context.Categories.Update(category);
    await context.SaveChangesAsync();
    return category;
  }


  // DELETE CATEGORY
  public async Task<Category> DeleteAsync(int id)
  {
    var category = await GetCategory(id);
    if (category == null) throw new KeyNotFoundException($"Category with ID {id} not found.");
    context.Categories.Remove(category);
    await context.SaveChangesAsync();
    if (category.ImageUrl != null) await imageService.DeleteImageAsync(category.ImageUrl);
    return category;
  }


  // HELPER - is category name unique?
  public async Task<bool> IsCategoryNameUniqueAsync(string name)
  {
    return !await context.Categories.AnyAsync(c => c.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
  }


  // HELPER - get category by id
  public async Task<Category> GetCategory(int id)
  {
    var category = await context.Categories.FindAsync(id);
    if (category == null) throw new KeyNotFoundException($"Category with ID {id} not found.");
    return category;
  }


  // HELPER - update category name + all the checks
  public async Task<Category> UpdateCategoryNameAsync(Category category, string newName)
  {
    if (category.Name != null && category.Name != newName)
    {
      if (!IsCategoryNameUniqueAsync(newName!).Result) throw new InvalidOperationException("Category name must be unique.");
      category.Name = newName!;
    }
    return category;
  }


  // HELPER - update category image and delete old image
  public async Task<Category> UpdateCategoryImageAsync(Category category, IFormFile? file)
  {
    var oldImage = category.ImageUrl;
    category.ImageUrl = await imageService.UploadImageAsync(file!);
    if (oldImage != null) await imageService.DeleteImageAsync(oldImage);
    return category;
  }

}
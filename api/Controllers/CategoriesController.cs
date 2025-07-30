using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Api.Interfaces;
using Api.Dtos;
using Api.Entities;



namespace Api.Controllers;



public class CategoriesController(ICategoryRepository categoryRepository, ICategoryCacheService categoryCacheService) : BaseApiController
{
  // CREATE CATEGORY (POST /api/categories)
  [Authorize(Roles = "Admin")]
  [HttpPost]
  public async Task<ActionResult<ApiResponse<Category>>> CreateCategory([FromForm] CategoryCreate categoryCreateDto)
  {
    if (string.IsNullOrWhiteSpace(categoryCreateDto.Name)) return Error<Category>(400, "Category name is required");
    var category = await categoryRepository.CreateAsync(categoryCreateDto, User);
    var cachedCategories = await categoryCacheService.GetCategoriesAsync();
    var updatedCategories = cachedCategories.Append(category);
    await categoryCacheService.UpdateCategoriesAsync(updatedCategories);
    return Success(201, "Category created", category);
  }


  // GET ALL CATEGORIES (GET /api/categories)
  [AllowAnonymous]
  [HttpGet]
  public async Task<ActionResult<ApiResponse<IEnumerable<Category>>>> GetAllCategories()
  {
    var cachedCategories = await categoryCacheService.GetCategoriesAsync();
    if (cachedCategories != null && cachedCategories.Any()) return Success(200, "Categories fetched from cache", cachedCategories);
    var categories = await categoryRepository.GetAllAsync();
    await categoryCacheService.UpdateCategoriesAsync(categories);
    return Success(200, "Categories fetched", categories);
  }


  // GET CATEGORY BY ID (GET /api/categories/{id})
  [AllowAnonymous]
  [HttpGet("{id:int}")]
  public async Task<ActionResult<ApiResponse<Category>>> GetCategoryById(int id)
  {
    var category = await categoryRepository.GetByIdAsync(id);
    if (category == null) return Error<Category>(404, $"Category with ID {id} not found");
    return Success(200, "Category fetched", category);
  }


  // UPDATE CATEGORY (PUT /api/categories)
  [Authorize(Roles = "Admin")]
  [HttpPut]
  public async Task<ActionResult<ApiResponse<Category>>> UpdateCategory([FromForm] CategoryUpdate categoryUpdateDto)
  {
    if (categoryUpdateDto.Id <= 0) return Error<Category>(400, "Invalid category ID");
    if (string.IsNullOrWhiteSpace(categoryUpdateDto.Name)) return Error<Category>(400, "Category name is required");
    var updatedCategory = await categoryRepository.UpdateAsync(categoryUpdateDto);
    if (updatedCategory == null) return Error<Category>(404, $"Category with ID {categoryUpdateDto.Id} not found");
    var cachedCategories = await categoryCacheService.GetCategoriesAsync();
    var updatedCategories = cachedCategories.Where(c => c.Id != updatedCategory.Id).Append(updatedCategory);
    await categoryCacheService.UpdateCategoriesAsync(updatedCategories);
    return Success(200, "Category updated", updatedCategory);
  }


  // DELETE CATEGORY (DELETE /api/categories/{id})
  [Authorize(Roles = "Admin")]
  [HttpDelete("{id:int}")]
  public async Task<ActionResult<ApiResponse<bool>>> DeleteCategory(int id)
  {
    if (id <= 0) return Error<bool>(400, "Invalid category ID");
    var deleted = await categoryRepository.DeleteAsync(id);
    if (deleted == null) return Error<bool>(404, $"Category with ID {id} not found");
    var cachedCategories = await categoryCacheService.GetCategoriesAsync();
    var updatedCategories = cachedCategories.Where(c => c.Id != id);
    await categoryCacheService.UpdateCategoriesAsync(updatedCategories);
    return Success(200, "Category deleted", true);
  }
}
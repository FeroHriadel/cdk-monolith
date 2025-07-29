using Api.Dtos;
using Api.Entities;



namespace Api.Controllers;



public class ItemResponse
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public List<int> TagIds { get; set; } = new();
    public List<string> TagNames { get; set; } = new();
    public List<string> ImageUrls { get; set; } = new();
    public required string CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
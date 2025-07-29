namespace Api.Dtos;



public class ItemUpdate
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int? CategoryId { get; set; }
    public List<int>? TagIds { get; set; }
    public List<IFormFile>? Images { get; set; }
}
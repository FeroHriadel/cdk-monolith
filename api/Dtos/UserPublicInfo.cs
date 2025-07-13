namespace Api.Dtos;



public class UserPublicInfo
{
  public required string Id { get; set; }
  public required string UserName { get; set; }
  public List<string>? Roles { get; set; } = [];
  public required DateTime UpdatedAt { get; set; }
  public required DateTime LastActive { get; set; }
}
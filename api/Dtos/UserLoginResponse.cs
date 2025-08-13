namespace Api.Dtos;


public class UserLoginResponse
{
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public required int Id { get; set; }
    public List<string>? Roles { get; set; } = [];
    public required DateTime LastActive { get; set; } = DateTime.UtcNow;
    public required DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public required DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
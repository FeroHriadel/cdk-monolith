// dotnet add package System.IdentityModel.Tokens.Jwt --version 8.6.1



using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Api.Entities;
using Api.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;



namespace Api.Services;


public class TokenService(IConfiguration config, UserManager<User> userManager) : ITokenService
{


  // CREATE TOKEN FROM USER CREDS
  public async Task<string> CreateTokenAsync(User user)
  {
    // check token config
    var tokenKey = config["TokenKey"] ?? throw new Exception("TokenKey is not configured in appsettings.json");
    if (tokenKey.Length < 64) throw new Exception("TokenKey must be at least 64 characters long");

    // create key
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

    // create claims - add email and roles
    var claims = new List<Claim> { new(ClaimTypes.Email, user.Email!) }; // email claim
    var roles = await userManager.GetRolesAsync(user);
    claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role))); // role claims

    // create token descriptor
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(claims),
      Expires = DateTime.UtcNow.AddDays(7),
      SigningCredentials = creds
    };

    // create token handler and token
    var tokenHandler = new JwtSecurityTokenHandler();
    var token = tokenHandler.CreateToken(tokenDescriptor);

    // return the token as a string
    return tokenHandler.WriteToken(token);
  }


  // GET EMAIL FROM CLAIMS
  public string GetEmailFromClaims(ClaimsPrincipal user)
  {
    // get email from claims
    return user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email || c.Type == "email")?.Value ?? throw new Exception("User email not found in claims.");
  }
}
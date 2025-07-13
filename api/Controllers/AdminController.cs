using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Api.Dtos;
using Api.Entities;
using Microsoft.AspNetCore.Identity;



namespace Api.Controllers;



[Authorize]
public class AdminController(UserManager<User> userManager) : BaseApiController
{

  // Admin Test Endpoint - GET api/admin/test
  [Authorize(Roles = "Admin")]
  [HttpGet("test")]
  public async Task<ActionResult<string>> TestAdminEndpoint()
  {
    // this endpoint is only accessible to users with the "Admin" role
    return Ok("Admin endpoint accessed successfully.");
  }


  // Make User Admin - POST api/admin/makeuseradmin
  [AllowAnonymous]
  [HttpPost("makeuseradmin")]
  public async Task<ActionResult> MakeUserAdmin([FromBody] MakeUserAdminRequest request)
  {
    // find user by email
    var user = await userManager.FindByEmailAsync(request.Email);
    if (user == null) return NotFound("User not found.");

    // check if user already has Admin role
    var isAdmin = await userManager.IsInRoleAsync(user, "Admin");
    if (isAdmin) return BadRequest("User is already an Admin.");

    // add Admin role to user
    var result = await userManager.AddToRoleAsync(user, "Admin");
    if (!result.Succeeded) return BadRequest("Failed to add Admin role to user.");

    return Ok("User successfully made an Admin.");
  }
}
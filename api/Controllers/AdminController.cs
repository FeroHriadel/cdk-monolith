using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Api.Dtos;
using Api.Entities;
using Microsoft.AspNetCore.Identity;

namespace Api.Controllers;

[Authorize]
public class AdminController(UserManager<User> userManager) : BaseApiController
{
  // ADMIN TEST POINT - GET api/admin/test
  [Authorize(Roles = "Admin")]
  [HttpGet("test")]
  public async Task<ActionResult<ApiResponse<string>>> TestAdminEndpoint()
  {
    return Success(200, "Admin endpoint accessed successfully.", "Admin endpoint accessed successfully.");
  }


  // MAKE USER ADMIN - POST api/admin/makeuseradmin
  [AllowAnonymous]
  [HttpPost("makeuseradmin")]
  public async Task<ActionResult<ApiResponse<string>>> MakeUserAdmin([FromBody] MakeUserAdminRequest request)
  {
    // find user by email
    var user = await userManager.FindByEmailAsync(request.Email);
    if (user == null) return Error<string>(404, "User not found.");

    // check if user already has Admin role
    var isAdmin = await userManager.IsInRoleAsync(user, "Admin");
    if (isAdmin) return Error<string>(400, "User is already an Admin.");

    // add Admin role to user
    var result = await userManager.AddToRoleAsync(user, "Admin");
    if (!result.Succeeded) return Error<string>(400, "Failed to add Admin role to user.");
    return Success(200, "User successfully made an Admin.", "User successfully made an Admin.");
  }
}

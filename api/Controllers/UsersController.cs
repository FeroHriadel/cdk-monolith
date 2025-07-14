using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Api.Interfaces;
using Api.Dtos;
using Api.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;



namespace Api.Controllers;



[Authorize]
public class UsersController(UserManager<User> userManager, ITokenService tokenService, IMapper mapper) : BaseApiController
{


    // Get User by Id - GET api/users/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserPublicInfo>> GetUserById(int id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        var userDto = mapper.Map<UserPublicInfo>(user);
        return Ok(userDto);
    }


    // Get User by Username - GET api/users/username/{username}
    [HttpGet("username/{username}")]
    public async Task<ActionResult<UserPublicInfo>> GetUserByUsername(string username)
    {
        var user = await userManager.FindByNameAsync(username);
        if (user == null) return NotFound();
        var userDto = mapper.Map<UserPublicInfo>(user);
        return Ok(userDto);
    }


    // Get user by email - GET api/users/email/{email}
    [HttpGet("email/{email}")]
    public async Task<ActionResult<UserPublicInfo>> GetUserByEmail(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null) return NotFound();
        var userDto = mapper.Map<UserPublicInfo>(user);
        return Ok(userDto);
    }


    // Create User - POST api/users
    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<UserPublicInfo>> CreateUser(UserRegistration userCreateDto)
    {
        // validate the incoming DTO
        var user = mapper.Map<User>(userCreateDto);
        user.UserName = userCreateDto.UserName;
        user.Email = userCreateDto.Email;
        var result = await userManager.CreateAsync(user, userCreateDto.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);

        // assign default role and create token
        await userManager.AddToRoleAsync(user, "User");
        var token = await tokenService.CreateTokenAsync(user);
        
        // respond with the created user and token
        var userLoginResponse = new UserLoginResponse
        {
            Token = token,
            UserName = user.UserName,
            Email = user.Email,
            Id = user.Id,
            Roles = (await userManager.GetRolesAsync(user)).ToList(),
            LastActive = user.LastActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
        return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, userLoginResponse);
    }

    // Login User - POST api/users/login
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserLoginResponse>> LoginUser(UserLoginRequest userLoginDto)
    {
        // validate the incoming DTO
        var user = await userManager.FindByEmailAsync(userLoginDto.Email);
        if (user == null) return Unauthorized("Invalid username or password");
        var passwordCheck = await userManager.CheckPasswordAsync(user, userLoginDto.Password);
        if (!passwordCheck) return Unauthorized("Invalid username or password");

        // create token and respond with user login response
        var token = await tokenService.CreateTokenAsync(user);
        var userLoginResponse = new UserLoginResponse
        {
            Token = token,
            UserName = user.UserName!,
            Email = user.Email!,
            Id = user.Id,
            Roles = (await userManager.GetRolesAsync(user)).ToList(),
            LastActive = user.LastActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
        return Ok(userLoginResponse);
    }

}
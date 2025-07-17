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

    // GET USER BY ID- GET api/users/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<UserPublicInfo>>> GetUserById(int id)
    {
        var user = await userManager.FindByIdAsync(id.ToString());
        if (user == null)
            return Error<UserPublicInfo>(404, "User not found");

        var userDto = mapper.Map<UserPublicInfo>(user);
        return Success(200, "User found", userDto);
    }


    // GET USER BY USERNAME - GET api/users/username/{username}
    [HttpGet("username/{username}")]
    public async Task<ActionResult<ApiResponse<UserPublicInfo>>> GetUserByUsername(string username)
    {
        var user = await userManager.FindByNameAsync(username);
        if (user == null) return Error<UserPublicInfo>(404, "User not found");
        var userDto = mapper.Map<UserPublicInfo>(user);
        return Success(200, "User found", userDto);
    }


    // GET USER BY EMAIL - GET api/users/email/{email}
    [HttpGet("email/{email}")]
    public async Task<ActionResult<ApiResponse<UserPublicInfo>>> GetUserByEmail(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null) return Error<UserPublicInfo>(404, "User not found");
        var userDto = mapper.Map<UserPublicInfo>(user);
        return Success(200, "User found", userDto);
    }


    // CREATE USER - POST api/users
    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<UserLoginResponse>>> CreateUser(UserRegistration userCreateDto)
    {
        // check if username or email already exists
        var existingUser = await userManager.FindByNameAsync(userCreateDto.UserName);
        if (existingUser != null) return Error<UserLoginResponse>(400, "Username already exists");
        existingUser = await userManager.FindByEmailAsync(userCreateDto.Email);
        if (existingUser != null) return Error<UserLoginResponse>(400, "Email already exists");

        // save user
        var user = mapper.Map<User>(userCreateDto);
        user.UserName = userCreateDto.UserName;
        user.Email = userCreateDto.Email;
        var result = await userManager.CreateAsync(user, userCreateDto.Password);
        if (!result.Succeeded) return Error<UserLoginResponse>(400, string.Join("; ", result.Errors.Select(e => e.Description)));

        // assign default role and create token
        await userManager.AddToRoleAsync(user, "User");
        var token = await tokenService.CreateTokenAsync(user);

        // respond
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
        return Success(201, "User created", userLoginResponse);
    }


    // LOGIN USER - POST api/users/login
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<UserLoginResponse>>> LoginUser(UserLoginRequest userLoginDto)
    {
        var user = await userManager.FindByEmailAsync(userLoginDto.Email);
        if (user == null) return Error<UserLoginResponse>(401, "Invalid username or password");
        var passwordCheck = await userManager.CheckPasswordAsync(user, userLoginDto.Password);
        if (!passwordCheck) return Error<UserLoginResponse>(401, "Invalid username or password");
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
        return Success(200, "Login successful", userLoginResponse);
    }

}

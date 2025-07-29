// $ dotnet add package AutoMapper --version 12.0.1
// $ dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection --version 12.0.1



using Api.Controllers;
using Api.Dtos;
using Api.Entities;
using AutoMapper;



namespace Api.Mapping;



public class AutoMapperProfiles : Profile
{
  public AutoMapperProfiles()
  {
    // Mapping from User entity to UserPublicInfo DTO
    CreateMap<User, UserPublicInfo>()
      .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
      .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName))
      .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt))
      .ForMember(dest => dest.LastActive, opt => opt.MapFrom(src => src.LastActive));

    // UserRegistration DTO to User entity
    CreateMap<UserRegistration, User>();

    // Item entity to ItemResponse DTO
    CreateMap<Item, ItemResponse>()
      .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
      .ForMember(dest => dest.TagNames, opt => opt.MapFrom(src => src.Tags.Select(t => t.Name).ToList()))
      .ForMember(dest => dest.TagIds, opt => opt.MapFrom(src => src.Tags.Select(t => t.Id).ToList()))
      .ForMember(dest => dest.ImageUrls, opt => opt.MapFrom(src =>
        src.Images != null
        ? System.Text.Json.JsonSerializer.Deserialize<List<string>>(src.Images, default(System.Text.Json.JsonSerializerOptions)) ?? new List<string>()
        : new List<string>()));
  }
}
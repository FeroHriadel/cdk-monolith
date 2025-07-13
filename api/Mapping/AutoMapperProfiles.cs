// $ dotnet add package AutoMapper --version 12.0.1
// $ dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection --version 12.0.1



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
  }
}
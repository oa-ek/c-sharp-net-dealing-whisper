using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using Whisper.Application.DTOs.UserDTOs;
using Whisper.Domain.Entities;

namespace Whisper.Application.Mappings
{
    public class UserMapper : Profile
    {
        public UserMapper()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserUpdateDto, User>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}

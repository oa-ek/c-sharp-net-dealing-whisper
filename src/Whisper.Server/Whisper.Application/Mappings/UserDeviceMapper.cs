using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using Whisper.Application.DTOs.UserDevicesDTOs;
using Whisper.Domain.Entities;

namespace Whisper.Application.Mappings
{
    public class UserDeviceMapper : Profile
    {
        public UserDeviceMapper()
        {
            CreateMap<UserDevice, DeviceDto>()
                .ForMember(dest => dest.LastSeen, opt => opt.MapFrom(src => src.TokenExpiresAt));
        }
    }
}

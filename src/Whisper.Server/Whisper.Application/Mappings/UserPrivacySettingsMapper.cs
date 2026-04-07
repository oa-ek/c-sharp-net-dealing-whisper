using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using Whisper.Application.DTOs.UserPrivacyDTOs;
using Whisper.Domain.Entities;

namespace Whisper.Application.Mappings
{
    public class UserPrivacySettingMapper : Profile
    {
        public UserPrivacySettingMapper()
        {
            CreateMap<UserPrivacySetting, UserPrivacyDto>();
            CreateMap<UserPrivacyUpdateDto, UserPrivacySetting>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}

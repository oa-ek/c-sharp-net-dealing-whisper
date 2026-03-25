using AutoMapper;
using Whisper.Application.DTOs.ChatDTOs;
using Whisper.Domain.Entities;

namespace Whisper.Application.Mappings
{
    public class ChatMapper : Profile
    {
        public ChatMapper()
        {
            CreateMap<Chat, ChatDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()));

            CreateMap<Chat, ChatDetailsDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Members, opt => opt.MapFrom(src => src.Members.ToList()));

            CreateMap<ChatCreateDto, Chat>();
        }
    }
}

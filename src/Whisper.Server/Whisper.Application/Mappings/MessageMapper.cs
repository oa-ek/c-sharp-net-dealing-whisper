using AutoMapper;
using Whisper.Application.DTOs.MessageDTOs;
using Whisper.Domain.Entities;

namespace Whisper.Application.Mappings
{
    public class MessageMapper : Profile
    {
        public MessageMapper()
        {
            CreateMap<MessageCreateDto, Message>()
                .ForMember(dest => dest.ChatId, opt => opt.MapFrom(src => Guid.Parse(src.ChatId)))
                .ForMember(dest => dest.ParentMessageId, opt => opt.MapFrom(src => Guid.Parse(src.ParentMessageId)));

            CreateMap<MessageUpdateDto, Message>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)));

            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.ChatId, opt => opt.MapFrom(src => src.ChatId.ToString()))
                .ForMember(dest => dest.SenderId, opt => opt.MapFrom(src => src.SenderId.ToString()))
                .ForMember(dest => dest.ParentMessageId, opt => opt.MapFrom(src => src.ParentMessageId.ToString()));
        }
    }
}

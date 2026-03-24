using Whisper.Application.DTOs.MessageDTOs;

namespace Whisper.Application.Interfaces.Services
{
    public interface IMessageService
    {
        public Task<MessageDto> AddAsync(string userId, MessageCreateDto message);
        public Task<MessageDto> EditAsync(string userId, MessageUpdateDto message);
        public Task<MessageDto> MarkReadAsync(string userId, string messageId);
    }
}

using Whisper.Application.DTOs.ChatDTOs;
using Whisper.Application.DTOs.MessageDTOs;
using Whisper.Application.DTOs.UserDTOs;

namespace Whisper.Application.Interfaces.Services
{
    public interface IChatService
    {
        public Task<IEnumerable<ChatDto>> GetAllAsync(string userId);
        public Task<ChatDetailsDto> GetByIdAsync(string userId, string chatId);
        public Task<ChatDetailsDto> EditAsync(string userId, ChatUpdateDto updatedChat);
        public Task<ChatDetailsDto> RemoveAsync(string userId, string chatId);
        public Task<IEnumerable<UserDto>> GetParticipantsAsync(string userId, string chatId);
        public Task<IEnumerable<MessageDto>> GetMessagesAsync(string userId, string chatId, int limit, int offset);
        public Task<ChatDto> CreateChatAsync(string userId, string receiverId, ChatCreateDto chat);
    }
}

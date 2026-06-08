using AutoMapper;
using System.ComponentModel;
using Whisper.Application.DTOs.ChatDTOs;
using Whisper.Application.DTOs.MessageDTOs;
using Whisper.Application.DTOs.UserDTOs;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;
using Whisper.Domain.Entities;

namespace Whisper.Application.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        public ChatService(IChatRepository chatRepository, IMessageRepository messageRepository, IMapper mapper)
        {
            _chatRepository = chatRepository;
            _messageRepository = messageRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ChatDto>> GetAllAsync(string userId)
        {
            var chats = await _chatRepository.GetListAsync(Guid.Parse(userId));
            var resultChats = chats.Select(c => _mapper.Map<ChatDto>(c)).ToList();
            for (int i = 0; i < resultChats.Count(); i++)
            {
                resultChats[i].UnreadMessages = await _messageRepository.CountUnreadMessages(new Guid(userId), new Guid(resultChats[i].Id));
            }
            return resultChats;
        }

        public async Task<ChatDetailsDto>GetByIdAsync(string userId, string chatId)
        {
            var chat = await _chatRepository.GetByIdAsync(Guid.Parse(chatId));
            if (chat.Members.Any(u => u.UserId.ToString() != userId))
                throw new Exception("User doesn't own that chat");
            return _mapper.Map<ChatDetailsDto>(chat);
        }

        public async Task<ChatDetailsDto> EditAsync(string userId, ChatUpdateDto updatedChat)
        {
            var chat = await _chatRepository.GetByIdAsync(Guid.Parse(updatedChat.Id));
           if (chat.Members.Any(u => u.UserId.ToString() != userId))
                throw new Exception("User doesn't own that chat");
            chat.Name = updatedChat.Name;
            var updChat = await _chatRepository.UpdateAsync(chat);
            _chatRepository.SaveAsync();
            return _mapper.Map<ChatDetailsDto>(updChat);
        }

        public async Task<ChatDetailsDto> RemoveAsync(string userId, string chatId)
        {
            var chat = await _chatRepository.GetByIdAsync(Guid.Parse(chatId));
           if (chat.Members.Any(u => u.UserId.ToString() != userId))
                throw new Exception("User doesn't own that chat");
            var removedChat = await _chatRepository.Remove(Guid.Parse(chatId));
            _chatRepository.SaveAsync();
            return _mapper.Map<ChatDetailsDto>(removedChat);
        }

        public async Task<IEnumerable<UserDto>> GetParticipantsAsync(string userId, string chatId)
        {
            var chat = await _chatRepository.GetByIdAsync(Guid.Parse(chatId));
           if (chat.Members.Any(u => u.UserId.ToString() != userId))
                throw new Exception("User doesn't own that chat");
            var users = (await _chatRepository.GetParticipants(Guid.Parse(chatId))).ToList();
            return users.Select(u => _mapper.Map<UserDto>(u));
        }

        public async Task<IEnumerable<MessageDto>> GetMessagesAsync(string userId, string chatId, int limit, int offset)
        {
            var chat = await _chatRepository.GetByIdAsync(Guid.Parse(chatId));
           if (chat.Members.Any(u => u.UserId.ToString() != userId))
                throw new Exception("User doesn't own that chat");
            var messages = (await _messageRepository.GetLimitedAsync(chatId, limit, offset)).ToList();
            return messages.Select(m => _mapper.Map<MessageDto>(m));
        }

        public async Task<ChatDto> CreateChatAsync(string userId, string receiverId, ChatCreateDto chat)
        {
            var createdChat = _mapper.Map<Chat>(chat);
            //createdChat.CreatedBy = Guid.Parse(userId);
            createdChat.Members.Add(new ChatMember() { UserId = Guid.Parse(userId), IsAdmin = true });
            createdChat.Members.Add(new ChatMember() { UserId = Guid.Parse(receiverId), IsAdmin = false });
            var chatResult = await _chatRepository.AddAsync(createdChat);
            await _chatRepository.SaveAsync();
            var resultChat = _mapper.Map<ChatDto>(chatResult);
            resultChat.UnreadMessages = 0;
            return resultChat;
        }

        public async Task<int> GetCountAsync(string userId)
        {
            return await _chatRepository.GetCount(new Guid(userId));
        }
    }
}

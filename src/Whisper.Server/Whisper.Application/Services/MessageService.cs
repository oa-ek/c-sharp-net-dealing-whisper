using AutoMapper;
using Whisper.Application.DTOs.MessageDTOs;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;
using Whisper.Domain.Entities;
using Whisper.Domain.Enums;

namespace Whisper.Application.Services
{
    public class MessageService : IMessageService
    {
        private readonly IMapper _mapper;
        private readonly IMessageRepository _messageRepository;
        private readonly IChatRepository _chatRepository;
        public MessageService(IMessageRepository messageRepository, IChatRepository chatRepository, IMapper mapper)
        {
            _messageRepository = messageRepository;
            _chatRepository = chatRepository;
            _mapper = mapper;
        }

        public async Task<MessageDto> AddAsync(string userId, MessageCreateDto message)
        {
            var chatParticipants = (await _chatRepository.GetParticipants(Guid.Parse(message.ChatId)))
                .Select(p => p.Id)
                .ToList();
            if (chatParticipants == null)
                throw new Exception("Chat was not found");

            if (!chatParticipants.Contains(Guid.Parse(userId)))
                throw new Exception("User doesn't participate in that chat");

            var parsedMessage = _mapper.Map<Message>(message);
            parsedMessage.SenderId = Guid.Parse(userId);
            var newMessage = _mapper.Map<MessageDto>(
                    await _messageRepository.AddAsync(parsedMessage)
                );
            await _messageRepository.SaveAsync();
            return newMessage;
        }

        public async Task<MessageDto> EditAsync(string userId, MessageUpdateDto message)
        {
            var chat = await _messageRepository.GetByIdAsync(Guid.Parse(message.Id));
            if (chat == null)
                throw new Exception("The message is broken and doesn't belong to any chat. Crazy.");

            var chatParticipants = (await _chatRepository.GetParticipants(chat.Id))
                .Select(p => p.Id)
                .ToList();
            if (chatParticipants == null)
                throw new Exception("Chat was not found");

            if (!chatParticipants.Contains(Guid.Parse(userId)))
                throw new Exception("User doesn't participate in that chat");

            var updatedMessage = await _messageRepository.EditAsync(_mapper.Map<Message>(message));
            await _messageRepository.SaveAsync();
            return _mapper.Map<MessageDto>(updatedMessage);
        }

        public async Task<MessageDto> MarkReadAsync(string userId, string messageId)
        {
            var chat = await _messageRepository.GetByIdAsync(Guid.Parse(messageId));
            if (chat == null)
                throw new Exception("The message is broken and doesn't belong to any chat. Crazy.");

            var chatParticipants = (await _chatRepository.GetParticipants(chat.Id))
                .Select(p => p.Id)
                .ToList();
            if (chatParticipants == null)
                throw new Exception("Chat was not found");

            if (!chatParticipants.Contains(Guid.Parse(userId)))
                throw new Exception("User doesn't participate in that chat");

            var updatedMessage = await _messageRepository.EditDeliveryStatusAsync(Guid.Parse(messageId), DeliveryStatus.Read);
            await _messageRepository.SaveAsync();
            return _mapper.Map<MessageDto>(updatedMessage);
        }
    }
}

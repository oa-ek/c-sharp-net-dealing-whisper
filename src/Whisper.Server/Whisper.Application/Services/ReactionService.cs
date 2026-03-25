using AutoMapper;
using Whisper.Application.DTOs.MessageDTOs;
using Whisper.Application.DTOs.ReactionDTOs;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;
using Whisper.Domain.Entities;

namespace Whisper.Application.Services
{
    public class ReactionService : IReactionService
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IChatRepository _chatRepository;
        private readonly IMapper _mapper;
        public ReactionService(IMessageRepository messageRepository, IChatRepository chatRepository, IMapper mapper)
        {
            _messageRepository = messageRepository;
            _chatRepository = chatRepository;
            _mapper = mapper;
        }

        public async Task<MessageDto> AddReaction(string userId, ReactionCreateDto reaction)
        {
            var message = await _messageRepository.GetByIdAsync(Guid.Parse(reaction.MessageId));
            if (message == null)
                throw new Exception("Message does not exist. Find another message id to set reactions to.");

            var chatParticipants = (await _chatRepository.GetParticipants(message.ChatId))
                .Select(p => p.Id)
                .ToList();
            if (chatParticipants == null)
                throw new Exception("User cannot even see the message. Why set reactions to it?");

            message.Reactions.Add(_mapper.Map<Reaction>(reaction));
            return _mapper.Map<MessageDto>(message);
        }

        public async Task<MessageDto> RemoveReaction(string userId, ReactionRemoveDto reaction)
        {
            var message = await _messageRepository.GetByIdAsync(Guid.Parse(reaction.MessageId));
            if (message == null)
                throw new Exception("Message does not exist. Find another message id to remove reactions from.");

            var chatParticipants = (await _chatRepository.GetParticipants(message.ChatId))
                .Select(p => p.Id)
                .ToList();
            if (chatParticipants == null)
                throw new Exception("User cannot even see the message. Why remove reactions from it?");

            var removedReaction = message.Reactions
                .FirstOrDefault(r => r.ReactionId.ToString() == reaction.Id);
            if (removedReaction == null)
                throw new Exception("Reaction doesn't exist");
            message.Reactions.Remove(removedReaction);
            return _mapper.Map<MessageDto>(message);
        }
    }
}

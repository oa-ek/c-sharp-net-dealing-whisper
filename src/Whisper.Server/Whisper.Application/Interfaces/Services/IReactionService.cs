using Whisper.Application.DTOs.MessageDTOs;
using Whisper.Application.DTOs.ReactionDTOs;

namespace Whisper.Application.Interfaces.Services
{
    public interface IReactionService
    {
        public Task<MessageDto> AddReaction(string userId, ReactionCreateDto reaction);
        public Task<MessageDto> RemoveReaction(string userId, ReactionRemoveDto reaction);
    }
}

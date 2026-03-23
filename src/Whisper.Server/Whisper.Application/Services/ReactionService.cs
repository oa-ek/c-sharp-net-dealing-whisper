using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;

namespace Whisper.Application.Services
{
    public class ReactionService : IReactionService
    {
        private readonly IReactionRepository _reactionRepository;
        public ReactionService(IReactionRepository reactionRepository)
        {
            _reactionRepository = reactionRepository;
        }

    }
}

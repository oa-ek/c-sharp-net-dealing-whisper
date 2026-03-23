using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;

namespace Whisper.Application.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRepository _chatRepository;
        public ChatService(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

    }
}

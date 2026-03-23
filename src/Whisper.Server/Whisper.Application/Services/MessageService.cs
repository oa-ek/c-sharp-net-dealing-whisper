using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;

namespace Whisper.Application.Services
{
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;
        public MessageService(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }

    }
}

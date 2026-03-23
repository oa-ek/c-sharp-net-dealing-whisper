using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;

namespace Whisper.Application.Services
{
    public class OneTimePreKeyService : IOneTimePreKeyService
    {
        private readonly IOneTimePreKeyRepository _oneTimePreKeyRepository;
        public OneTimePreKeyService(IOneTimePreKeyRepository oneTimePreKeyRepository)
        {
            _oneTimePreKeyRepository = oneTimePreKeyRepository;
        }

    }
}

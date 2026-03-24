using Whisper.Domain.Entities;

namespace Whisper.Application.Interfaces.Repositories
{
    public interface IChatRepository : IRepository<Chat>
    {
        public Task<IEnumerable<Guid>> GetParticipants(Guid chatId);
    }
}

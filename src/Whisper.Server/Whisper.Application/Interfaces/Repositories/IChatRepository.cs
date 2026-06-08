using Whisper.Domain.Entities;

namespace Whisper.Application.Interfaces.Repositories
{
    public interface IChatRepository : IRepository<Chat>
    {
        public Task<Chat> UpdateAsync(Chat chat);
        public Task<IEnumerable<Chat>> GetListAsync(Guid userId);
        public Task<IEnumerable<User>> GetParticipants(Guid chatId);
        public Task<int> GetCount(Guid userId);
    }
}

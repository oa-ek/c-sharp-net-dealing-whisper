using Microsoft.EntityFrameworkCore;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Domain.Entities;
using Whisper.Persistence.Context;

namespace Whisper.Persistence.Repositories
{
    public class ChatRepository : Repository<Chat>, IChatRepository
    {
        public ChatRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Guid>?> GetParticipants(Guid chatId)
        {
            return _dbSet
                .Include(c => c.Members)
                .FirstOrDefault(c => c.Id == chatId)?
                .Members?
                .Select(m => m.UserId)?
                .ToList() ?? null;
        }
    }
}

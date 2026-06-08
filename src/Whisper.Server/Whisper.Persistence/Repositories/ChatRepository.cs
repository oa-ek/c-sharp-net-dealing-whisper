using Microsoft.EntityFrameworkCore;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Domain.Entities;
using Whisper.Persistence.Context;

namespace Whisper.Persistence.Repositories
{
    public class ChatRepository : Repository<Chat>, IChatRepository
    {
        public ChatRepository(AppDbContext context) : base(context) { }

        public async Task<Chat> UpdateAsync(Chat chat)
        {
            var updatedChat = _dbSet.Update(chat);
            return chat;
        }

        public async Task<IEnumerable<Chat>> GetListAsync(Guid userId)
        {
            return await _dbSet
                .Include(c => c.Members)
                .Where(c => c.Members.Any(m => m.UserId == userId))
                .ToListAsync();
        } 

        public async Task<IEnumerable<User>?> GetParticipants(Guid chatId)
        {
            return _dbSet
                .Include(c => c.Members)
                .ThenInclude(m => m.User)
                .FirstOrDefault(c => c.Id == chatId)?
                .Members?
                .Select(m => m.User)
                .ToList() ?? null;
        }

        public async Task<int> GetCount(Guid userId)
        {
            return _dbSet
                .Include(c => c.Members)
                .Where(c => c.Members.Any(m => m.UserId == userId))
                .Count();
        }
    }
}

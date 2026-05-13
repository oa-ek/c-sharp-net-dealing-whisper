using Microsoft.EntityFrameworkCore;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Domain.Entities;
using Whisper.Persistence.Context;

namespace Whisper.Persistence.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context) { }
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet
                .Include(u => u.Devices)
                .FirstOrDefaultAsync(u => u.Email == email);
        }
        public async Task UpdateAsync(User user)
        {
            // Idk if it will work actually. If something breaks, don't tell anyone I've been there. Please 
            _dbSet.Update(user);
            await Task.CompletedTask;
        }
        public async Task<int> GetCountAsync() => await _dbSet.CountAsync();

        public async Task<IEnumerable<KeyValuePair<DateTime, int>>> GetRegistrationStatsAsync(DateTime since)
        {
            return await _dbSet
                .Where(u => u.CreatedAt >= since)
                .GroupBy(u => u.CreatedAt.Date)
                .Select(g => new KeyValuePair<DateTime, int>(g.Key, g.Count()))
                .ToListAsync();
        }
    }
}

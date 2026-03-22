using Whisper.Application.Interfaces.Repositories;
using Whisper.Domain.Entities;
using Whisper.Persistence.Context;

namespace Whisper.Persistence.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context) { }

        public async Task UpdateAsync(User user)
        {
            // Idk if it will work actually. If something breaks, don't tell anyone I've been there. Please 
            _dbSet.Update(user);
            await Task.CompletedTask;
        }
    }
}

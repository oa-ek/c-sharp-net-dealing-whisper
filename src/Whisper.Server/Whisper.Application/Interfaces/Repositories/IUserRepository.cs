using Whisper.Domain.Entities;

namespace Whisper.Application.Interfaces.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task UpdateAsync(User user);
        Task<User?> GetByEmailAsync(string email);
        Task<int> GetCountAsync();
        Task<IEnumerable<KeyValuePair<DateTime, int>>> GetRegistrationStatsAsync(DateTime since);
    }
}

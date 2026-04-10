using Whisper.Domain.Entities;

namespace Whisper.Application.Interfaces.Repositories
{
    public interface IOneTimePreKeyRepository : IRepository<OneTimePreKey>
    {
        public Task<OneTimePreKey?> GetOneByDeviceIdAsync(Guid deviceId);
        public Task<OneTimePreKey> PatchUsedAsync(OneTimePreKey preKey);
        public Task<int> CountByUserDeviceAsync(Guid deviceId);
    }
}

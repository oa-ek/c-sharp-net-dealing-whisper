using Whisper.Application.Interfaces.Repositories;
using Whisper.Domain.Entities;
using Whisper.Persistence.Context;

namespace Whisper.Persistence.Repositories
{
    public class OneTimePreKeyRepository : Repository<OneTimePreKey>, IOneTimePreKeyRepository
    {
        public OneTimePreKeyRepository(AppDbContext context) : base(context) { }

        public async Task<OneTimePreKey?> GetOneByDeviceIdAsync(Guid deviceId)
        {
            return _dbSet
                .Where(k => k.DeviceId == deviceId && k.IsUsed == false)
                .FirstOrDefault();
        }

        public async Task<OneTimePreKey> PatchUsedAsync(OneTimePreKey preKey)
        {
            preKey.IsUsed = true;
            _dbSet.Update(preKey);
            return preKey;
        }

        public async Task<int> CountByUserDeviceAsync(Guid deviceId)
        {
            return _dbSet
                .Where(k => k.DeviceId == deviceId)
                .Count();
        }
    }
}

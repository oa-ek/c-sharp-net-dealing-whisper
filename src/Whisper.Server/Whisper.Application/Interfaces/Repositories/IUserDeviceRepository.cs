using Whisper.Domain.Entities;

namespace Whisper.Application.Interfaces.Repositories
{
    public interface IUserDeviceRepository : IRepository<UserDevice>
    {
        Task<UserDevice?> GetByDeviceIdAsync(Guid deviceId);
    }
}

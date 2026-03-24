using Whisper.Application.DTOs.UserDevicesDTOs;

namespace Whisper.Application.Interfaces.Services
{
    public interface IUserDeviceService
    {
        Task<IEnumerable<DeviceDto>> GetDevicesAsync(Guid userId);
        Task<DeviceDto?> GetDeviceByIdAsync(Guid userId, Guid deviceId);
        Task DeleteDeviceAsync(Guid userId, Guid deviceId);
    }
}

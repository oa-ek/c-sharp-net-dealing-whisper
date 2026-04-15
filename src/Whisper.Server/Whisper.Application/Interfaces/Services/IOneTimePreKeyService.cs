using Whisper.Application.DTOs.KeyDTOs;

namespace Whisper.Application.Interfaces.Services
{
    public interface IOneTimePreKeyService
    {
        public Task<BundleDto> GetBundleAsync(string deviceId);
        public Task<BundleStatusDto> AddKeysAsync(string userId, string deviceId,  IEnumerable<string> keys);
        public Task<BundleStatusDto> GetCountAsync(string userId, string deviceId);
    }
}

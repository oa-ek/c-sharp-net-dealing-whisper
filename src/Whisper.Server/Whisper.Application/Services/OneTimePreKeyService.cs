using Whisper.Application.DTOs.KeyDTOs;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;
using Whisper.Domain.Entities;

namespace Whisper.Application.Services
{
    public class OneTimePreKeyService : IOneTimePreKeyService
    {
        private readonly IOneTimePreKeyRepository _oneTimePreKeyRepository;
        private readonly IUserDeviceRepository _userDeviceRepository;
        public OneTimePreKeyService(IOneTimePreKeyRepository oneTimePreKeyRepository, IUserDeviceRepository userDeviceRepository)
        {
            _oneTimePreKeyRepository = oneTimePreKeyRepository;
            _userDeviceRepository = userDeviceRepository;
        }

        public async Task<BundleDto> GetBundleAsync(string deviceId)
        {
            Guid deviceGuid = Guid.Parse(deviceId);

            var userDevice = await _userDeviceRepository.GetByIdAsync(deviceGuid);
            if (userDevice == null)
                throw new Exception("UserDevice does not exist");

            var key = await _oneTimePreKeyRepository.GetOneByDeviceIdAsync(deviceGuid);
            if (key == null)
                throw new Exception("UserDevice does not have any keys left!");
            
            var bundle = new BundleDto()
            {
                DeviceId = deviceId,
                PublicIdentityKey = userDevice.PublicIdentityKey,
                SignedPreKey = userDevice.SignedPreKey,
                SignedPreKeySignature = userDevice.SignedPreKeySignature,
                OneTimePreKeyId = key.Id.ToString(),
                OneTimePreKey = key.PublicKey
            };

            await _oneTimePreKeyRepository.PatchUsedAsync(key);

            await _oneTimePreKeyRepository.SaveAsync();
            return bundle;
        }

        public async Task<BundleStatusDto> AddKeysAsync(string userId, string deviceId, IEnumerable<string> keys)
        {
            Guid deviceGuid = Guid.Parse(deviceId);

            var userDevice = await _userDeviceRepository.GetByIdAsync(deviceGuid);
            if (userDevice == null)
                throw new Exception("UserDevice does not exist!");
            if (userDevice.UserId.ToString() != userId)
                throw new Exception("User doesn't own UserDevice!");

            var oneTimePreKeys = keys
                .Select(k => new OneTimePreKey() { 
                    DeviceId = deviceGuid,
                    PublicKey = k
                })
                .ToList();

            await _oneTimePreKeyRepository.AddRangeAsync(oneTimePreKeys);
            await _oneTimePreKeyRepository.SaveAsync();
            return new BundleStatusDto() {
                DeviceId = deviceId,
                OneTimePreKeysCount = await _oneTimePreKeyRepository.CountByUserDeviceAsync(deviceGuid)
            };
        }

        public async Task<BundleStatusDto> GetCountAsync(string userId, string deviceId)
        {
            Guid deviceGuid = Guid.Parse(deviceId);

            var userDevice = await _userDeviceRepository.GetByIdAsync(deviceGuid);
            if (userDevice == null)
                throw new Exception("UserDevice does not exist!");
            if (userDevice.UserId.ToString() != userId)
                throw new Exception("User doesn't own UserDevice!");

            return new BundleStatusDto()
            {
                DeviceId = deviceId,
                OneTimePreKeysCount = await _oneTimePreKeyRepository.CountByUserDeviceAsync(deviceGuid)
            };
        }
    }
}

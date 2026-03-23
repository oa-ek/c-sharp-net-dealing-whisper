using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;

namespace Whisper.Application.Services
{
    public class UserPrivacySettingService : IUserPrivacySettingService
    {
        private readonly IUserPrivacySettingRepository _userPrivacySettingRepository;
        public UserPrivacySettingService(IUserPrivacySettingRepository userPrivacySettingRepository)
        {
            _userPrivacySettingRepository = userPrivacySettingRepository;
        }

    }
}

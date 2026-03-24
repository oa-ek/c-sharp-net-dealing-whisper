using Whisper.Application.DTOs.UserPrivacyDTOs;

namespace Whisper.Application.Interfaces.Services
{
    public interface IUserPrivacySettingService
    {
        Task<UserPrivacyDto> GetPrivacyAsync(Guid userId);
        Task UpdatePrivacyAsync(Guid userId, UserPrivacyUpdateDto dto);
    }
}

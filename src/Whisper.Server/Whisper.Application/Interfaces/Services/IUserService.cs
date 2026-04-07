using Whisper.Application.DTOs.UserDTOs;

namespace Whisper.Application.Interfaces.Services
{
    public interface IUserService
    {
        Task<UserDto?> GetMeAsync(Guid userId);
        Task<UserDto> UpdateMeAsync(Guid userId, UserUpdateDto dto);
        Task<IEnumerable<UserDto>> SearchUsersAsync(string username);
    }
}

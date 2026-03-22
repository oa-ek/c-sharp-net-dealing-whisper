using System;
using System.Threading.Tasks;
using Whisper.Application.DTOs.AuthDTOs;

namespace Whisper.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<AuthResponseDto> RefreshTokenAsync(string accessToken, string refreshToken);

        Task<bool> ChangePasswordAsync(Guid userId, string newPassword);
        Task<bool> VerifyCurrentPasswordAsync(Guid userId, string password);
    }
}
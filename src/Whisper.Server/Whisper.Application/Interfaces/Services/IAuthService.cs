using System;
using System.Collections.Generic;
using System.Text;
using Whisper.Application.DTOs.AuthDTOs;

namespace Whisper.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<AuthResponseDto> RefreshTokenAsync(AuthResponseDto dto);
        Task<bool> ChangePasswordAsync(int userId, string newPassword);
        Task VerifyCurrentPasswordAsync(int userId, string password);
    }
}

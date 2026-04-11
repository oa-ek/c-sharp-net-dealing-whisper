using Whisper.Application.DTOs.AuthDTOs;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;
using Whisper.Domain.Entities;

namespace Whisper.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserDeviceRepository _deviceRepository;
        private readonly ITokenService _tokenService;
        private readonly IPasswordService _passwordService;

        public AuthService(
            IUserRepository userRepository,
            IUserDeviceRepository deviceRepository,
            ITokenService tokenService,
            IPasswordService passwordService)
        {
            _userRepository = userRepository;
            _deviceRepository = deviceRepository;
            _tokenService = tokenService;
            _passwordService = passwordService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
            if (existingUser != null)
                throw new Exception("User with such email already exists");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = dto.Username,
                Email = dto.Email,
                // Використовуємо новий сервіс для хешування
                PasswordHash = _passwordService.HashPassword(dto.Password),
                CreatedAt = DateTime.UtcNow,
                LastSeen = DateTime.UtcNow,
                ETwoFactorSecret = Guid.NewGuid().ToString()
            };

            var deviceId = Guid.NewGuid();
            var device = new UserDevice
            {
                Id = deviceId,
                UserId = user.Id,
                DeviceName = dto.DeviceName ?? "Unknown Device",
                DeviceType = dto.DeviceType ?? "Web",
                PublicIdentityKey = dto.PublicIdentityKey,
                SignedPreKey = dto.SignedPreKey,
                SignedPreKeySignature = dto.SignedPreKeySignature,
                RefreshToken = _tokenService.GenerateRefreshToken(),
                TokenExpiresAt = DateTime.UtcNow.AddDays(7)
            };

            if (dto.OneTimePreKeys != null)
            {
                foreach (var key in dto.OneTimePreKeys)
                {
                    device.OneTimePreKeys.Add(new OneTimePreKey { PublicKey = key });
                }
            }

            user.Devices.Add(device);

            await _userRepository.AddAsync(user);
            await _userRepository.SaveAsync();

            return new AuthResponseDto
            {
                AccessToken = _tokenService.CreateToken(user, deviceId),
                RefreshToken = device.RefreshToken,
                RefreshTokenExpiration = device.TokenExpiresAt,
                DeviceId = deviceId
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);

            if (user == null || !_passwordService.VerifyPassword(dto.Password, user.PasswordHash))
                throw new Exception("Incorrect email or password");

            var device = await _deviceRepository.GetByIdAsync(dto.DeviceId);
            if (device == null)
                throw new Exception("Device not recognized. Device registration required.");

            device.RefreshToken = _tokenService.GenerateRefreshToken();
            device.TokenExpiresAt = DateTime.UtcNow.AddDays(7);

            await _deviceRepository.SaveAsync();

            return new AuthResponseDto
            {
                AccessToken = _tokenService.CreateToken(user, device.Id),
                RefreshToken = device.RefreshToken,
                RefreshTokenExpiration = device.TokenExpiresAt,
                DeviceId = device.Id
            };
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(string accessToken, string refreshToken)
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
            var deviceIdClaim = principal.FindFirst("deviceId")?.Value;

            if (string.IsNullOrEmpty(deviceIdClaim))
                throw new Exception("Invalid token");

            var deviceId = Guid.Parse(deviceIdClaim);
            var device = await _deviceRepository.GetByIdAsync(deviceId);

            if (device == null || device.RefreshToken != refreshToken || device.TokenExpiresAt <= DateTime.UtcNow)
                throw new Exception("The session is out of date or invalid.");

            var user = await _userRepository.GetByIdAsync(device.UserId);
            if (user == null) throw new Exception("User not found");

            device.RefreshToken = _tokenService.GenerateRefreshToken();
            device.TokenExpiresAt = DateTime.UtcNow.AddDays(7);
            await _deviceRepository.SaveAsync();

            return new AuthResponseDto
            {
                AccessToken = _tokenService.CreateToken(user, device.Id),
                RefreshToken = device.RefreshToken,
                RefreshTokenExpiration = device.TokenExpiresAt,
                DeviceId = device.Id
            };
        }

        public async Task<bool> VerifyCurrentPasswordAsync(Guid userId, string password)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return false;

            return _passwordService.VerifyPassword(password, user.PasswordHash);
        }

        public async Task<bool> ChangePasswordAsync(Guid userId, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return false;

            user.PasswordHash = _passwordService.HashPassword(newPassword);
            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveAsync();

            return true;
        }
    }
}
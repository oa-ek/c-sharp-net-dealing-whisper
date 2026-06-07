using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Whisper.Application.DTOs.AuthDTOs;
using Whisper.Application.Interfaces.Services;

namespace Whisper.Server.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Tags("Authentication")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AuthResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            try
            {
                var result = await _authService.RegisterAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AuthResponseDto))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                var result = await _authService.LoginAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
        }
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var deviceIdClaim = User.FindFirst("deviceId")?.Value;
            if (string.IsNullOrEmpty(deviceIdClaim)) return BadRequest();

            await _authService.LogoutAsync(Guid.Parse(deviceIdClaim));
            return Ok();
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            var result = await _authService.ChangePasswordAsync(
                Guid.Parse(userIdClaim),
                dto.CurrentPassword,
                dto.NewPassword
            );

            if (!result) return BadRequest(new { message = "Невірний старий пароль" });
            return Ok();
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromHeader(Name = "Authorization")] string authHeader, [FromBody] string refreshToken)
        {
            try
            {
                var accessToken = authHeader.Replace("Bearer ", "");
                var result = await _authService.RefreshTokenAsync(accessToken, refreshToken);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            // Завжди повертаємо Ok, щоб не видавати існування емейлів у базі
            await _authService.SendPasswordResetCodeAsync(dto.Email);
            return Ok(new { message = "Якщо такий емейл існує, код відправлено." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var result = await _authService.ResetPasswordWithCodeAsync(dto);
            if (!result)
                return BadRequest(new { message = "Невірний код або термін дії коду вичерпано." });

            return Ok(new { message = "Пароль успішно змінено." });
        }
    }
}
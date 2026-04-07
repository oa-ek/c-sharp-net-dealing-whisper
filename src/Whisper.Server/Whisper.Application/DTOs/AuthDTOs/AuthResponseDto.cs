using System;
using System.Collections.Generic;
using System.Text;

namespace Whisper.Application.DTOs.AuthDTOs
{
    public class AuthResponseDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime RefreshTokenExpiration { get; set; }
        public Guid DeviceId { get; set; }
    }
}

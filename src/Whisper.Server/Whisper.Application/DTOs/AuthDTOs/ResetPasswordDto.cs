using System;
using System.Collections.Generic;
using System.Text;

namespace Whisper.Application.DTOs.AuthDTOs
{
    public class ResetPasswordDto
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}

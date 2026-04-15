using System;
using System.Collections.Generic;
using System.Text;

namespace Whisper.Application.DTOs.AuthDTOs
{
    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}


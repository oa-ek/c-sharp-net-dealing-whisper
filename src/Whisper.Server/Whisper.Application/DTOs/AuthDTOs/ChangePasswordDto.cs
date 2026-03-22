using System;
using System.Collections.Generic;
using System.Text;

namespace Whisper.Application.DTOs.AuthDTOs
{
    public class ChangePasswordDto
    {
        public string NewPassword { get; set; } = string.Empty;
    }
}

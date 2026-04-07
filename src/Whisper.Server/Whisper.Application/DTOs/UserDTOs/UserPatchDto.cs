using System;
using System.Collections.Generic;
using System.Text;

namespace Whisper.Application.DTOs.UserDTOs
{
    public class UserUpdateDto
    {
        public string? DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? PfpLink { get; set; }
    }
}

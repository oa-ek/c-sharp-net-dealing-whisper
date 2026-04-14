using System;
using System.Collections.Generic;
using System.Text;

namespace Whisper.Application.DTOs.UserDTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string? DisplayName { get; set; }
        public string? PfpLink { get; set; }
        public string? Bio { get; set; }
        public DateTime LastSeen { get; set; }
        public List<string> ActiveDeviceIds { get; set; } = new();
    }
}

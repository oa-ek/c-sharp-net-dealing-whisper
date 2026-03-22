using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Whisper.Application.DTOs.AuthDTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(6)]
        public string Password { get; set; } = string.Empty;

        public string? DeviceName { get; set; } 
        public string? DeviceType { get; set; }

        [Required]
        public string PublicIdentityKey { get; set; } = string.Empty;
        [Required]
        public string SignedPreKey { get; set; } = string.Empty;

        public List<string> OneTimePreKeys { get; set; } = new List<string>();
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Whisper.Application.DTOs.UserDevicesDTOs
{
    public class RegisterDeviceDto
    {
        [Required]
        public string DeviceName { get; set; } = "Unknown Device";
        [Required]
        public string DeviceType { get; set; } = "Web";

        [Required]
        public string PublicIdentityKey { get; set; }
        [Required]
        public string SignedPreKey { get; set; }
        [Required]
        public string SignedPreKeySignature { get; set; }

        public List<string> OneTimePreKeys { get; set; } = new List<string>();
    }
}

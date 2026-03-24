using System;
using System.Collections.Generic;
using System.Text;

namespace Whisper.Application.DTOs.UserDevicesDTOs
{
    public class DeviceDto
    {
        public Guid Id { get; set; }
        public string? DeviceName { get; set; }
        public string? DeviceType { get; set; }
        public DateTime LastSeen { get; set; }
    }
}

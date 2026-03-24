using System;
using System.Collections.Generic;
using System.Text;

namespace Whisper.Application.DTOs.UserPrivacyDTOs
{
    public class UserPrivacyUpdateDto
    {
        public bool? LastSeenPrivacy { get; set; }
        public bool? ProfileSeenPrivacy { get; set; }
        public bool? AllowGroupsFrom { get; set; }
        public bool? TwoFAIsEnabled { get; set; }
    }
}

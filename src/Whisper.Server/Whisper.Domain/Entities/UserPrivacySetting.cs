using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Whisper.Domain.Entities
{
    public class UserPrivacySetting
    {
        [Required]
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public bool LastSeenPrivacy { get; set; } = false;
        public bool ProfileSeenPrivacy { get; set; } = false;
        public bool AllowGroupsFrom { get; set; } = false;


        public bool TwoFAIsEnabled { get; set; } = false;
    }
}

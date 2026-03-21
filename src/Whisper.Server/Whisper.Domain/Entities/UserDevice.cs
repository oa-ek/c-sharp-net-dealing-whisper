using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Whisper.Domain.Entities
{
    public class UserDevice
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        public string PublicIdentityKey { get; set; }
        public string SignedPreKey { get; set; }

        public string RefreshToken { get; set; } = string.Empty;
        public DateTime TokenExpiresAt { get; set; }

        public string? DeviceName { get; set; }
        public string? DeviceType { get; set; }


        public virtual ICollection<OneTimePreKey> OneTimePreKeys { get; set; } = new List<OneTimePreKey>();
    }
}

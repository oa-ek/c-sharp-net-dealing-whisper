using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Whisper.Domain.Entities
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required, MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        public string? DisplayName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        //secure
        public string PasswordHash { get; set; }

        //protocol
        public string ETwoFactorSecret { get; set; }


        public string? PfpLink { get; set; }
        public string? Bio { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastSeen { get; set; } = DateTime.UtcNow;

        public virtual ICollection<UserDevice> Devices { get; set; } = new List<UserDevice>();
        public virtual ICollection<ChatMember> ChatMembers { get; set; } = new List<ChatMember>();

    }
}

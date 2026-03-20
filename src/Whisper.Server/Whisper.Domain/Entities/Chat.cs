using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Whisper.Domain.Entities
{
    public class Chat
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [MaxLength(100)]
        public string Name { get; set; }
        public bool IsGroup { get; set; } = false;
        public DateTime CreatedBy { get; set; } = DateTime.UtcNow;

        public virtual ICollection<ChatMember> Members { get; set; } = new List<ChatMember>();
    }
}

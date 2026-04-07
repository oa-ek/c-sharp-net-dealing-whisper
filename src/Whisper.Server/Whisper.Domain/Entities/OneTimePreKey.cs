using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Whisper.Domain.Entities
{
    public class OneTimePreKey
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid DeviceId { get; set; }
        [ForeignKey("DeviceId")]
        public virtual UserDevice UserDevice { get; set; }

        public string PublicKey { get; set; } = string.Empty;
        public bool IsUsed { get; set; } = false;
    }
}

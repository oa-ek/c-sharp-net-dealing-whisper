using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;
using Whisper.Domain.Enums;

namespace Whisper.Domain.Entities
{
    public class Message
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string SenderId { get; set; }
        public string ChatId { get; set; }

        public string Ciphertext { get; set; }
        public string WrappedKey { get; set; }
        public string ParentMessageId { get; set; } 
        public DeliveryStatus DeliveryStatus { get; set; } = DeliveryStatus.Sent;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public List<Attachment> Attachments { get; set; } = new();
        public List<Reaction> Reactions { get; set; } = new();
    }
}

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
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; } = Guid.NewGuid();

        [BsonRepresentation(BsonType.String)]
        public Guid SenderId { get; set; }
        [BsonRepresentation(BsonType.String)]
        public Guid ChatId { get; set; }

        public string Ciphertext { get; set; }
        public string WrappedKey { get; set; }
        [BsonRepresentation(BsonType.String)]
        public Guid? ParentMessageId { get; set; } 
        public DeliveryStatus DeliveryStatus { get; set; } = DeliveryStatus.Sent;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public List<Attachment> Attachments { get; set; } = new();
        public List<Reaction> Reactions { get; set; } = new();
    }
}

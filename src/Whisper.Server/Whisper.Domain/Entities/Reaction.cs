using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Whisper.Domain.Entities
{
    public class Reaction
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ReactionId { get; set; }
        
        public string UserId { get; set; }
        public string Emoji { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

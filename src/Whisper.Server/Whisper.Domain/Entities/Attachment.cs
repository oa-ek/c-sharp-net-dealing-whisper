using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Whisper.Domain.Entities
{
    public class Attachment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string AttachmentId { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string ContentType { get; set; }
        public uint Size { get; set; }
    }
}

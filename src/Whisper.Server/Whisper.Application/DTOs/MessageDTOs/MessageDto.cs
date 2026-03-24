using Whisper.Application.DTOs.ReactionDTOs;
using Whisper.Domain.Entities;

namespace Whisper.Application.DTOs.MessageDTOs
{
    public class MessageDto
    {
        public string Id { get; set; }
        public string ChatId { get; set; }
        public string SenderId { get; set; }
        public string Ciphertext { get; set; }
        public string WrappedKey { get; set; }
        public string? ParentMessageId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<Attachment> Attachments { get; set; }
        public List<ReactionDto> Reactions { get; set; }
    }
}

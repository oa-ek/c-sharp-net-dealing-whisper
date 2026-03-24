using Whisper.Domain.Entities;

namespace Whisper.Application.DTOs.MessageDTOs
{
    public class MessageCreateDto
    {
        public string ChatId { get; set; }
        public string Ciphertext { get; set; }
        public string WrappedKey { get; set; }
        public string? ParentMessageId { get; set; }
        public List<Attachment> Attachments { get; set; }
    }
}

using Whisper.Domain.Entities;

namespace Whisper.Application.DTOs.MessageDTOs
{
    public class MessageUpdateDto
    {
        public string Id { get; set; }
        public string Ciphertext { get; set; }
        public string WrappedKey { get; set; }
        public List<Attachment> Attachments { get; set; }
    }
}

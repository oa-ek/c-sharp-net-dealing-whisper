using Whisper.Domain.Entities;

namespace Whisper.Application.DTOs.ChatDTOs
{
    public class ChatDetailsDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool IsGroup { get; set; }
        public string CreatedBy { get; set; }
        public List<ChatMember> Members { get; set; }
    }
}

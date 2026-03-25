namespace Whisper.Application.DTOs.ChatDTOs
{
    public class ChatCreateDto
    {
        public string Name { get; set; }
        public bool IsGroup { get; set; } = false;
    }
}

namespace Whisper.Application.DTOs.ReactionDTOs
{
    public class ReactionDto
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string Emoji { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

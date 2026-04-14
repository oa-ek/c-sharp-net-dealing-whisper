namespace Whisper.Application.DTOs.EmailDTOs
{
    public class EmailDto
    {
        public string FromEmail { get; set; }
        public string ToEmail { get; set; }
        public string Subject { get; set; }
        public string HtmlBody { get; set; }
    }
}

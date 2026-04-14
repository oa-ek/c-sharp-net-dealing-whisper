namespace Whisper.Application.DTOs.EmailDTOs
{
    public class SendEmailDto
    {
        public string ToEmail { get; set; }
        public string Subject { get; set; }
        public string HtmlBody { get; set; }
    }
}

using Whisper.Application.DTOs.EmailDTOs;

namespace Whisper.Application.Interfaces.Services
{
    public interface IEmailService
    {
        public Task<EmailDto> SendEmailAsync(SendEmailDto email);
    }
}

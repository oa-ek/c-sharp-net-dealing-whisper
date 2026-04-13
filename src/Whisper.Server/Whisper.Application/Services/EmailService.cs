using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using Whisper.Application.Common.Config;
using Whisper.Application.DTOs.EmailDTOs;
using Whisper.Application.Interfaces.Services;

namespace Whisper.Application.Services
{
    public class EmailService : IEmailService
    {
        private SmtpClient _smtpClient;
        private string _fromEmail;
        private string _fromName; 
        public EmailService(string smtpHost, int smtpPort, string username, string password, string fromEmail, string fromName)
        {
            _smtpClient = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };
            _fromEmail = fromEmail;
            _fromName = fromName;
        }
        public EmailService(IOptions<EmailSettings> options)
        {
            var settings = options.Value;
            _smtpClient = new SmtpClient(settings.SmtpHost, settings.SmtpPort)
            {
                Credentials = new NetworkCredential(settings.Username, settings.Password),
                EnableSsl = true
            };
            _fromEmail = settings.FromEmail;
            _fromName = settings.FromName;
        }

        public async Task<EmailDto> SendEmailAsync(SendEmailDto email)
        {
            var message = new MailMessage()
            {
                From = new MailAddress(_fromEmail, _fromName),
                Subject = email.Subject,
                Body = email.HtmlBody,
                IsBodyHtml = true
            };
            message.To.Add(email.ToEmail);

            await _smtpClient.SendMailAsync(message);

            return new EmailDto
            {
                ToEmail = email.ToEmail,
                FromEmail = _fromEmail,
                Subject = email.Subject,
                HtmlBody = email.HtmlBody,
            };
        }
    }
}

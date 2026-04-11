using Whisper.Application.Interfaces.Services;
using BC = BCrypt.Net.BCrypt;

namespace Whisper.Application.Services
{
    public class PasswordService : IPasswordService
    {
        public string HashPassword(string password)
        {
            return BC.HashPassword(password);
        }

        public bool VerifyPassword(string password, string hash)
        {
            return BC.Verify(password, hash);
        }
    }
}
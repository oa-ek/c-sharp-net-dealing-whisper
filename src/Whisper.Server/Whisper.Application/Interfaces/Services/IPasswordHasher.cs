using System;
using System.Collections.Generic;
using System.Text;

namespace Whisper.Application.Interfaces.Services
{
    public interface IPasswordService
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string hash);
    }
}

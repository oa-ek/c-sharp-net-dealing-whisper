using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using Whisper.Domain.Entities;

namespace Whisper.Application.Interfaces.Services
{
    public interface ITokenService
    {
        string CreateToken(User user, Guid deviceId);
        string GenerateRefreshToken();
        ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    }
}

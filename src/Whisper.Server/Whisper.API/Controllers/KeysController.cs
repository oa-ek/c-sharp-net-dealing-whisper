using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Whisper.Application.Interfaces.Services;

namespace Whisper.API.Controllers
{
    [Authorize]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class KeysController : ControllerBase
    {
        public readonly IOneTimePreKeyService _oneTimePreKeyService;
        public KeysController(IOneTimePreKeyService oneTimePreKeyService)
        {
            _oneTimePreKeyService = oneTimePreKeyService;
        }

        [HttpGet("/bundle/{deviceId}")]
        public async Task<IActionResult> GetBundle(string deviceId)
        {
            return Ok(await _oneTimePreKeyService.GetBundleAsync(UserId, deviceId));
        }

        [HttpPost("/bundle/{deviceId}")]
        public async Task<IActionResult> PostBundle(string deviceId, [FromBody] IEnumerable<string> publicKeys)
        {
            return Ok(await _oneTimePreKeyService.AddKeysAsync(UserId, deviceId, publicKeys));
        }

        [HttpGet("/status/{deviceId}")]
        public async Task<IActionResult> GetStatus(string deviceId)
        {
            return Ok(await _oneTimePreKeyService.GetCountAsync(UserId, deviceId));
        }

        private string UserId { get => User.FindFirstValue(ClaimTypes.NameIdentifier); }
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Whisper.Application.Interfaces.Services;

namespace Whisper.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class EmojisController : ControllerBase
    {
        public readonly IEmojiService _emojiService;
        public EmojisController(IEmojiService emojiService)
        {
            _emojiService = emojiService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try { return Ok(await _emojiService.GetAll()); }
            catch { return StatusCode(500); } 
        }

        [HttpGet("search")]
        public async Task<IActionResult> GetBySearch([FromQuery] string query)
        {
            try { return Ok(await _emojiService.GetBySearch(query)); }
            catch { return StatusCode(500); }
        }
    }
}

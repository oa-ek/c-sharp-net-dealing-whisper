using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Whisper.Application.Interfaces.Services;

namespace Whisper.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmojisController : ControllerBase
    {
        public readonly IEmojiService _emojiService;
        public EmojisController(IEmojiService emojiService)
        {
            _emojiService = emojiService;
        }

        [HttpGet("/")]
        public async Task<IActionResult> GetAll()
        {
            try { return Ok(_emojiService.GetAll()); }
            catch { return StatusCode(500); } 
        }

        [HttpGet("/search")]
        public async Task<IActionResult> GetBySearch([FromQuery] string search)
        {
            try { return Ok(_emojiService.GetBySearch(search)); }
            catch { return StatusCode(500); }
        }
    }
}

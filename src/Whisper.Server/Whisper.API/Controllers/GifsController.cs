using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Whisper.Application.Interfaces.Services;

namespace Whisper.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class GifsController : ControllerBase
    {
        public readonly IGifsService _gifsService;
        public GifsController(IGifsService gifsService)
        {
            _gifsService = gifsService;
        }

        [HttpGet("trending")]
        public async Task<IActionResult> GetTrending()
        {
            try { return Ok(await _gifsService.GetTrendingAsync()); }
            catch { return StatusCode(500); }
        }

        [HttpGet("search")]
        public async Task<IActionResult> GetBySearch([FromQuery] string query)
        {
            try { return Ok(await _gifsService.GetBySearchAsync(query)); }
            catch { return StatusCode(500); }
        }
    }
}

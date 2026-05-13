using Microsoft.AspNetCore.Mvc;
using Whisper.Application.Interfaces.Services;
using Whisper.Application.DTOs.BinlistDTOs;

namespace Whisper.API.Controllers.Api.v1;

[ApiController]
[Route("api/v1/[controller]")]
public class BinlistController : ControllerBase
{
    private readonly IBinlistService _binlistService;

    public BinlistController(IBinlistService binlistService)
    {
        _binlistService = binlistService;
    }

    [HttpGet("card/{bin}")]
    [ProducesResponseType(typeof(BinlistResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCardData(string bin)
    {
        if (string.IsNullOrEmpty(bin) || bin.Length < 6)
            return BadRequest("Invalid BIN format");

        var result = await _binlistService.GetBinInfoAsync(bin.Substring(0, 6));
        
        return result != null ? Ok(result) : NotFound("Card data not found");
    }
}
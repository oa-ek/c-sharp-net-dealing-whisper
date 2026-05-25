using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Whisper.Application.DTOs.MediaDTOs;
using Whisper.Application.Interfaces.Services;

namespace Whisper.API.Controllers;


[ApiController]
[Route("api/v1/[controller]")]
public class MediaController : ControllerBase
{
    private readonly IMediaService _mediaService;

    public MediaController(IMediaService mediaService)
    {
        _mediaService = mediaService;
    }

    [HttpPost("upload")]
    [DisableRequestSizeLimit]
    public async Task<ActionResult<AttachmentResponseDto>> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Файл не вибрано або він порожній.");

        using var stream = file.OpenReadStream();
        
        var attachment = await _mediaService.UploadFileAsync(stream, file.FileName, file.ContentType, file.Length);

        var response = new AttachmentResponseDto
        {
            AttachmentId = attachment.AttachmentId,
            Name = attachment.Name,
            ContentType = attachment.ContentType,
            Size = attachment.Size,
            Url = attachment.Url
        };

        return Ok(response);
    }

    [HttpGet("download/{fileId}")]
    public async Task<IActionResult> Download(string fileId)
    {
        if (string.IsNullOrWhiteSpace(fileId))
            return BadRequest("Валідний ідентифікатор файлу обов'язковий.");

        try
        {
            var fileStream = await _mediaService.DownloadFileAsync(fileId);
            return File(fileStream, "application/octet-stream");
        }
        catch (Exception)
        {
            return NotFound($"Медіа-файл {fileId} не знайдено.");
        }
    }
}
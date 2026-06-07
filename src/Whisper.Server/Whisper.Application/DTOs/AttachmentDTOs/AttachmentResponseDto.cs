using System;

namespace Whisper.Application.DTOs.MediaDTOs;

public class AttachmentResponseDto
{
    public Guid AttachmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public uint Size { get; set; }
}
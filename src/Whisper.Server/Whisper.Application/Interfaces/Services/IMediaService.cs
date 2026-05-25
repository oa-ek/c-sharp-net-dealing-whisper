using System;
using System.IO;
using System.Threading.Tasks;
using Whisper.Domain.Entities;

namespace Whisper.Application.Interfaces.Services;

public interface IMediaService
{
    Task<Attachment> UploadFileAsync(Stream fileStream, string fileName, string contentType, long fileSize);
    Task<Stream> DownloadFileAsync(string fileId);
}
using Minio;
using Minio.DataModel.Args;
using System;
using System.IO;
using System.Threading.Tasks;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;
using Whisper.Domain.Entities;

namespace Whisper.Application.Services;

public class MinioMediaService : IMediaService
{
    private readonly IMinioClient _minioClient;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly string _bucketName = "whisper-media";

    public MinioMediaService(IMinioClient minioClient, IAttachmentRepository attachmentRepository)
    {
        _minioClient = minioClient;
        _attachmentRepository = attachmentRepository;
    }

    public async Task<Attachment> UploadFileAsync(Stream fileStream, string fileName, string contentType, long fileSize)
    {
        var fileGuid = Guid.NewGuid();
        var fileIdForStorage = fileGuid.ToString("N");

        var putObjectArgs = new PutObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(fileIdForStorage)
            .WithStreamData(fileStream)
            .WithObjectSize(fileSize)
            .WithContentType(contentType);

        await _minioClient.PutObjectAsync(putObjectArgs);

        // 2. Створюємо доменну сутність
        var attachment = new Attachment
        {
            AttachmentId = fileGuid,
            Name = fileName,
            ContentType = contentType,
            Size = (uint)fileSize,
            Url = $"/api/v1/media/download/{fileIdForStorage}"
        };

        await _attachmentRepository.AddAsync(attachment);

        return attachment;
    }

    public async Task<Stream> DownloadFileAsync(string fileId)
    {
        var memoryStream = new MemoryStream();
        
        var getObjectArgs = new GetObjectArgs()
            .WithBucket(_bucketName)
            .WithObject(fileId)
            .WithCallbackStream(stream => stream.CopyTo(memoryStream));

        await _minioClient.GetObjectAsync(getObjectArgs);
        memoryStream.Position = 0;
        
        return memoryStream;
    }
}
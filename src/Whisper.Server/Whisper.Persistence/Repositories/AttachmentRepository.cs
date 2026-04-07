using MongoDB.Driver;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Domain.Entities;

namespace Whisper.Persistence.Repositories
{
    public class AttachmentRepository : MongoRepository<Attachment>, IAttachmentRepository
    {
        public AttachmentRepository(IMongoDatabase database) : base(database, "attachments-collection") { }

    }
}

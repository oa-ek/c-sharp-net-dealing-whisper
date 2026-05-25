using MongoDB.Driver;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Domain.Entities;

namespace Whisper.Persistence.Repositories
{
    public class AttachmentRepository : MongoRepository<Attachment>, IAttachmentRepository
    {
        public AttachmentRepository(IMongoDatabase database) : base(database, "attachments-collection") { }

        public override async Task<Attachment> GetByIdAsync(Guid id)
        {
            return await _collection.Find(Builders<Attachment>.Filter.Eq(a => a.AttachmentId, id)).FirstOrDefaultAsync();
        }

        public override async Task<Attachment?> Remove(Guid id)
        {
            return await _collection.FindOneAndDeleteAsync(Builders<Attachment>.Filter.Eq(a => a.AttachmentId, id));
        }
    }
}

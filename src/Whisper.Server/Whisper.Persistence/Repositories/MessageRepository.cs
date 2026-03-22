using MongoDB.Driver;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Domain.Entities;

namespace Whisper.Persistence.Repositories
{
    public class MessageRepository : MongoRepository<Message>, IMessageRepository
    {
        public MessageRepository(IMongoDatabase database, string collectionName) : base(database, collectionName) { }

    }
}

using MongoDB.Driver;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Domain.Entities;

namespace Whisper.Persistence.Repositories
{
    public class ReactionRepository : MongoRepository<Reaction>, IReactionRepository
    {
        public ReactionRepository(IMongoDatabase database) : base(database, "reactions-collection") { }

    }
}

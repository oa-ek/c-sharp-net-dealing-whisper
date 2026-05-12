using MongoDB.Driver;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Domain.Entities;
using Whisper.Domain.Enums;

namespace Whisper.Persistence.Repositories
{
    public class MessageRepository : MongoRepository<Message>, IMessageRepository
    {
        public MessageRepository(IMongoDatabase database) : base(database, "messages-collection") { }

        public async Task<Message> EditAsync(Message message)
        {
            var update = Builders<Message>.Update
                .Set(m => m.Ciphertext, message.Ciphertext)
                .Set(m => m.WrappedKey, message.WrappedKey)
                .Set(m => m.Attachments, message.Attachments);
            return await _collection.FindOneAndUpdateAsync(Builders<Message>.Filter.Eq("Id", message.Id), update);
        }

        public async Task<Message> EditDeliveryStatusAsync(Guid messageId, DeliveryStatus deliveryStatus)
        {
            var update = Builders<Message>.Update
                .Set(m => m.DeliveryStatus, deliveryStatus);
            return await _collection.FindOneAndUpdateAsync(Builders<Message>.Filter.Eq("Id", messageId), update);
        }

        public async Task<IEnumerable<Message>> GetLimitedAsync(string chatId, int limit, int offset)
        {
            return await _collection.Find(m => m.ChatId.ToString() == chatId)
                .SortByDescending(m => m.CreatedAt)
                .Skip(offset)
                .Limit(limit)
                .SortBy(m => m.CreatedAt)
                .ToListAsync();
        }
    }
}

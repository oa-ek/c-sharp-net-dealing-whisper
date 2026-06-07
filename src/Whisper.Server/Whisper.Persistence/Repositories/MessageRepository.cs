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
            var options = new FindOneAndUpdateOptions<Message>
            {
                ReturnDocument = ReturnDocument.After
            };
            var update = Builders<Message>.Update
                .Set(m => m.Ciphertext, message.Ciphertext)
                .Set(m => m.WrappedKey, message.WrappedKey)
                .Set(m => m.Attachments, message.Attachments);
            return await _collection.FindOneAndUpdateAsync(Builders<Message>.Filter.Eq("Id", message.Id), update, options);
        }

        public override async Task<Message?> Remove(Guid id)
        {
            var message = await GetByIdAsync(id);
            if (message != null)
            {
                await base.Remove(id);
            }
            return message;
        }

        public async Task<Message> EditDeliveryStatusAsync(Guid messageId, DeliveryStatus deliveryStatus)
        {
            var options = new FindOneAndUpdateOptions<Message>
            {
                ReturnDocument = ReturnDocument.After
            };
            var update = Builders<Message>.Update
                .Set(m => m.DeliveryStatus, deliveryStatus);
            return await _collection.FindOneAndUpdateAsync(Builders<Message>.Filter.Eq("Id", messageId), update, options);
        }

        public async Task<int> CountUnreadMessages(Guid userId, Guid chatId)
        {
            return (int)await _collection.CountDocumentsAsync(m => m.ChatId == chatId && m.SenderId != userId && m.DeliveryStatus != DeliveryStatus.Read);
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
        public async Task<long> GetCountAsync() => 
            await _collection.CountDocumentsAsync(FilterDefinition<Message>.Empty);
        public async Task<Dictionary<DateTime, int>> GetMessageStatsAsync(DateTime since)
        {
            var stats = await _collection.Aggregate()
                .Match(m => m.CreatedAt >= since)
                .Group(
                    m => new { m.CreatedAt.Year, m.CreatedAt.Month, m.CreatedAt.Day },
                    g => new { Date = g.Key, Count = g.Count() }
                )
                .SortBy(x => x.Date)
                .ToListAsync();

            return stats.ToDictionary(
                x => new DateTime(x.Date.Year, x.Date.Month, x.Date.Day),
                x => x.Count
            );
        }
    }
}

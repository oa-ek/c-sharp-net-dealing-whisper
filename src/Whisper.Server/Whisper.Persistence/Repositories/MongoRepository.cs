using MongoDB.Driver;
using Whisper.Application.Interfaces.Repositories;

namespace Whisper.Persistence.Repositories
{
    public class MongoRepository<T> : IRepository<T> where T : class
    {
        protected readonly IMongoCollection<T> _collection;
        public MongoRepository(IMongoDatabase database, string collectionName)
        {
            _collection = database.GetCollection<T>(collectionName);
        }

        public virtual async Task<IQueryable<T>> GetAll() => _collection.AsQueryable();

        public virtual async Task<T> GetByIdAsync(Guid id)
        {
            return await _collection.Find(Builders<T>.Filter.Eq("Id", id)).FirstOrDefaultAsync() ;
        }

        public virtual async Task<T?> AddAsync(T entity)
        {
            await _collection.InsertOneAsync(entity);
            return entity;
        }

        public virtual async Task SaveAsync()
        {
            throw new NotImplementedException();
        }

        public virtual async Task<T?> Remove(Guid id) => await _collection.FindOneAndDeleteAsync(Builders<T>.Filter.Eq("Id", id));
        public virtual async Task<IEnumerable<T>> RemoveRange(IEnumerable<Guid> ids)
        {
            List<T> result = new();
            foreach (var id in ids)
            {
                var item = await Remove(id);
                if (item != null)
                    result.Add(item);
            }
            return result;
        }
    }
}

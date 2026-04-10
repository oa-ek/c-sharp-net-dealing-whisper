using Microsoft.EntityFrameworkCore;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Persistence.Context;

namespace Whisper.Persistence.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public virtual async Task<IQueryable<T>> GetAll() => _dbSet.AsQueryable();

        public virtual async Task<T?> GetByIdAsync(Guid id) => await _dbSet.FindAsync(id);

        public virtual async Task<T?> AddAsync(T entity) => (await _dbSet.AddAsync(entity))?.Entity;

        public virtual async Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities)
        {
            await _dbSet.AddRangeAsync(entities);
            return entities;
        } 

        public virtual async Task SaveAsync() => await _context.SaveChangesAsync();

        public virtual async Task<T?> Remove(Guid id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
                _dbSet.Remove(entity);
            return entity;
        }

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

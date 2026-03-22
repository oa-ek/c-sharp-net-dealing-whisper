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

        public virtual IQueryable<T> GetAll() => _dbSet.AsNoTracking();

        public virtual async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);

        public virtual async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);

        public virtual async Task SaveAsync() => await _context.SaveChangesAsync();

        public async Task Remove(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
                _dbSet.Remove(entity);
        }

        public async Task RemoveRange(IEnumerable<int> ids)
        {
            foreach (var id in ids)
                await Remove(id);
        }
    }
}

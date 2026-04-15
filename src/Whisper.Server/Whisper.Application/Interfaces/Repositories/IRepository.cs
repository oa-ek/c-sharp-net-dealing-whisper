namespace Whisper.Application.Interfaces.Repositories
{
    public interface IRepository<T> where T : class
    {
        Task<IQueryable<T>> GetAll();
        Task<T?> GetByIdAsync(Guid id);
        Task<T?> AddAsync(T entity);
        Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities);
        Task SaveAsync();
        Task<T?> Remove(Guid id);
        Task<IEnumerable<T>> RemoveRange(IEnumerable<Guid> ids);
    }
}

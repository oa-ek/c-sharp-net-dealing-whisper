namespace Whisper.Application.Interfaces.Repositories
{
    public interface IRepository<T> where T : class
    {
        IQueryable<T> GetAll();
        Task<T?> GetByIdAsync(Guid id);
        Task AddAsync(T entity);
        Task SaveAsync();
        Task Remove(Guid id);
        Task RemoveRange(IEnumerable<Guid> ids);
    }
}

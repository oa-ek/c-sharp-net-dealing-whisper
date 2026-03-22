namespace Whisper.Application.Interfaces.Repositories
{
    public interface IRepository<T> where T : class
    {
        IQueryable<T> GetAll();
        Task<T?> GetByIdAsync(int id);
        Task AddAsync(T entity);
        Task SaveAsync();
        Task Remove(int id);
        Task RemoveRange(IEnumerable<int> ids);
    }
}

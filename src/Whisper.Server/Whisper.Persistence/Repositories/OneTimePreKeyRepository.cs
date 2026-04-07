using Whisper.Application.Interfaces.Repositories;
using Whisper.Domain.Entities;
using Whisper.Persistence.Context;

namespace Whisper.Persistence.Repositories
{
    public class OneTimePreKeyRepository : Repository<OneTimePreKey>, IOneTimePreKeyRepository
    {
        public OneTimePreKeyRepository(AppDbContext context) : base(context) { }

    }
}

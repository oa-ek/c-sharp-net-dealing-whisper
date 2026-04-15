using Whisper.Application.Interfaces.Repositories;
using Whisper.Domain.Entities;
using Whisper.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Whisper.Persistence.Repositories
{
    public class UserDeviceRepository : Repository<UserDevice>, IUserDeviceRepository
    {
        public UserDeviceRepository(AppDbContext context) : base(context) { }

    }
}

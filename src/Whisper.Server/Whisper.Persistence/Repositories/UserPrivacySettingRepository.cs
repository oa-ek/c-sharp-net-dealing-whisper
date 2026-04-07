using Whisper.Application.Interfaces.Repositories;
using Whisper.Domain.Entities;
using Whisper.Persistence.Context;

namespace Whisper.Persistence.Repositories
{
    public class UserPrivacySettingRepository : Repository<UserPrivacySetting>, IUserPrivacySettingRepository
    {
        public UserPrivacySettingRepository(AppDbContext context) : base(context) { }

    }
}

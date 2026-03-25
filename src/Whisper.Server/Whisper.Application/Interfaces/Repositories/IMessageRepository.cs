using Whisper.Domain.Entities;
using Whisper.Domain.Enums;

namespace Whisper.Application.Interfaces.Repositories
{
    public interface IMessageRepository : IRepository<Message>
    {
        public Task<Message> EditAsync(Message message);
        public Task<Message> EditDeliveryStatusAsync(Guid messageId, DeliveryStatus deliveryStatus);
        public Task<IEnumerable<Message>> GetLimitedAsync(string chatId, int limit, int offset);
    }
}

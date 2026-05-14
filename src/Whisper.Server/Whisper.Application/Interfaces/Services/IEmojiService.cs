using Whisper.Application.DTOs.EmojiDTOs;

namespace Whisper.Application.Interfaces.Services
{
    public interface IEmojiService
    {
        public Task<IEnumerable<EmojiDto>?> GetAll();
        public Task<IEnumerable<EmojiDto>?> GetBySearch(string query);
    }
}

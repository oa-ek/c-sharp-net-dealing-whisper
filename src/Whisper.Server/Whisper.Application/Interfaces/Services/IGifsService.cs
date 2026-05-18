using Whisper.Application.DTOs.GifsDTOs;

namespace Whisper.Application.Interfaces.Services
{
    public interface IGifsService
    {
        public Task<GifResponseDto?> GetTrendingAsync();
        public Task<GifResponseDto?> GetBySearchAsync(string query);
    }
}

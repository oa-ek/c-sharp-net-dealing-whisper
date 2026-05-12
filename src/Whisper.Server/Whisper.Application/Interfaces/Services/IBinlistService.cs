using Whisper.Application.DTOs.BinlistDTOs;

namespace Whisper.Application.Interfaces.Services
{
    public interface IBinlistService
    {
        Task<BinlistResponseDto?> GetBinInfoAsync(string bin);
    }
}

using Whisper.Application.DTOs.AdminDTOs;

namespace Whisper.Application.Interfaces.Services
{
    public interface IAdminService
    {
        Task<AdminDashboardDto> GetDashboardDataAsync();
    }
}
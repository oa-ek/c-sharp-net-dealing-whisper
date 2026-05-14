using Whisper.Application.DTOs.AdminDTOs;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;

namespace Whisper.Application.Services;

public class AdminService : IAdminService
{
    private readonly IUserRepository _userRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IUserDeviceRepository _deviceRepository;
    private readonly IOnlineTracker _onlineTracker;

    public AdminService(
        IUserRepository userRepository,
        IMessageRepository messageRepository,
        IUserDeviceRepository deviceRepository,
        IOnlineTracker onlineTracker)
    {
        _userRepository = userRepository;
        _messageRepository = messageRepository;
        _deviceRepository = deviceRepository;
        _onlineTracker = onlineTracker;
    }

    public async Task<AdminDashboardDto> GetDashboardDataAsync()
{
    var lastWeek = DateTime.UtcNow.AddDays(-7);

    var totalUsers = await _userRepository.GetCountAsync();
    var totalMessages = await _messageRepository.GetCountAsync();
    var totalDevices = await _deviceRepository.GetAll();

    var registrationStats = await _userRepository.GetRegistrationStatsAsync(lastWeek);
    var messageStats = await _messageRepository.GetMessageStatsAsync(lastWeek);

    return new AdminDashboardDto
    {
        TotalUsers = totalUsers,
        OnlineNow = _onlineTracker.GetOnlineCount(),
        TotalMessages = (int)totalMessages,
        ActiveDevices = totalDevices.Count(),
        
        RegistrationStats = registrationStats.Select(s => new StatPointDto 
        { 
            Label = s.Key.ToString("dd MMM"), 
            Value = s.Value 
        }).ToList(),

        MessageStats = messageStats.Select(s => new StatPointDto 
        { 
            Label = s.Key.ToString("dd MMM"), 
            Value = s.Value 
        }).ToList()
    };
}
}
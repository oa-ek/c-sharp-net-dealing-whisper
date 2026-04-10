using AutoMapper;
using Whisper.Application.DTOs.UserDevicesDTOs;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

public class UserDeviceService : IUserDeviceService
{
    private readonly IUserDeviceRepository _repository;
    private readonly IMapper _mapper;

    public UserDeviceService(IUserDeviceRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<DeviceDto>> GetDevicesAsync(Guid userId)
    {
        var devices = await (await _repository.GetAll()).Where(d => d.UserId == userId).ToListAsync();
        return _mapper.Map<IEnumerable<DeviceDto>>(devices);
    }

    public async Task<DeviceDto?> GetDeviceByIdAsync(Guid userId, Guid deviceId)
    {
        var device = await _repository.GetByIdAsync(deviceId);
        return (device?.UserId == userId) ? _mapper.Map<DeviceDto>(device) : null;
    }

    public async Task DeleteDeviceAsync(Guid userId, Guid deviceId)
    {
        var device = await _repository.GetByIdAsync(deviceId);
        if (device != null && device.UserId == userId)
        {
            await _repository.Remove(deviceId);
            await _repository.SaveAsync();
        }
    }
}
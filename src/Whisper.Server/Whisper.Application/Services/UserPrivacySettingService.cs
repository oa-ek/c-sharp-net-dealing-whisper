using AutoMapper;
using Whisper.Application.DTOs.UserPrivacyDTOs;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;
using Whisper.Domain.Entities;
using Microsoft.EntityFrameworkCore;

public class UserPrivacySettingService : IUserPrivacySettingService
{
    private readonly IRepository<UserPrivacySetting> _repository;
    private readonly IMapper _mapper;

    public UserPrivacySettingService(IRepository<UserPrivacySetting> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<UserPrivacyDto> GetPrivacyAsync(Guid userId)
    {
        var settings = await (await _repository.GetAll()).FirstOrDefaultAsync(s => s.UserId == userId);
        return _mapper.Map<UserPrivacyDto>(settings ?? new UserPrivacySetting { UserId = userId });
    }

    public async Task UpdatePrivacyAsync(Guid userId, UserPrivacyUpdateDto dto)
    {
        var settings = await (await _repository.GetAll()).FirstOrDefaultAsync(s => s.UserId == userId);
        if (settings == null)
        {
            settings = new UserPrivacySetting { UserId = userId };
            await _repository.AddAsync(settings);
        }
        _mapper.Map(dto, settings);
        await _repository.SaveAsync();
    }
}
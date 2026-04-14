using AutoMapper;
using Whisper.Application.DTOs.UserDTOs;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

public class UserService : IUserService
{
    private readonly IUserRepository _repository;
    private readonly IMapper _mapper;

    public UserService(IUserRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<UserDto?> GetMeAsync(Guid userId) =>
        _mapper.Map<UserDto>(await _repository.GetByIdAsync(userId));

    public async Task<UserDto> UpdateMeAsync(Guid userId, UserUpdateDto dto)
    {
        var user = await _repository.GetByIdAsync(userId) ?? throw new Exception("User not found");
        _mapper.Map(dto, user);
        await _repository.SaveAsync();
        return _mapper.Map<UserDto>(user);
    }

    public async Task<IEnumerable<UserDto>> SearchUsersAsync(string username)
    {
        var query = await _repository.GetAll();

        var users = await query
            .Include(u => u.Devices)
            .Where(u => u.Username.Contains(username))
            .ToListAsync();

        return _mapper.Map<IEnumerable<UserDto>>(users);
    }
}
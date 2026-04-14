using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Whisper.Application.DTOs.UserDTOs;
using Whisper.Application.DTOs.UserPrivacyDTOs;
using Whisper.Application.Interfaces.Services;
using Whisper.Domain.Entities;

[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IUserPrivacySettingService _privacyService;
    private readonly IUserDeviceService _deviceService;

    public UsersController(
        IUserService userService,
        IUserPrivacySettingService privacyService,
        IUserDeviceService deviceService)
    {
        _userService = userService;
        _privacyService = privacyService;
        _deviceService = deviceService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe() => Ok(await _userService.GetMeAsync(UserId));

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UserUpdateDto dto) => Ok(await _userService.UpdateMeAsync(UserId, dto));

    [HttpGet("search-user/{username}")]
    public async Task<IActionResult> Search(string username) => Ok(await _userService.SearchUsersAsync(username));

    [HttpPut("me/privacy")]
    public async Task<IActionResult> UpdatePrivacy([FromBody] UserPrivacyUpdateDto dto)
    {
        await _privacyService.UpdatePrivacyAsync(UserId, dto);
        return NoContent();
    }

    [HttpGet("devices")]
    public async Task<IActionResult> GetDevices() => Ok(await _deviceService.GetDevicesAsync(UserId));

    [HttpDelete("devices/{deviceId}")]
    public async Task<IActionResult> DeleteDevice(Guid deviceId)
    {
        await _deviceService.DeleteDeviceAsync(UserId, deviceId);
        return NoContent();
    }

    private Guid UserId => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
}
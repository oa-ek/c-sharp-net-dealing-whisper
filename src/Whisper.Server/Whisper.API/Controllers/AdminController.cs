using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Whisper.Application.Interfaces.Services;

namespace Whisper.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Tags("Adminpanel")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard() => 
        Ok(await _adminService.GetDashboardDataAsync());
}
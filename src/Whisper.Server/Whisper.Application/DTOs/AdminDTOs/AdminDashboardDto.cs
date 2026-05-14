namespace Whisper.Application.DTOs.AdminDTOs;

public class AdminDashboardDto
{
    public int TotalUsers { get; set; }
    public int OnlineNow { get; set; }
    public int TotalMessages { get; set; }
    public int ActiveDevices { get; set; }
    
    public List<StatPointDto> RegistrationStats { get; set; }
    public List<StatPointDto> MessageStats { get; set; }
}

public class StatPointDto
{
    public string Label { get; set; }
    public int Value { get; set; }
}
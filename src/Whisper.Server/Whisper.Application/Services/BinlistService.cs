using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Caching.Memory;
using System.Net.Http.Json;
using Whisper.Application.Interfaces.Services;
using Whisper.Application.DTOs.BinlistDTOs;

namespace Whisper.Application.Services;

public class BinlistService : IBinlistService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<BinlistService> _logger;
    private readonly IMemoryCache _cache;

    public BinlistService(HttpClient httpClient, ILogger<BinlistService> logger, IMemoryCache cache)
    {
        _httpClient = httpClient;
        _logger = logger;
        _cache = cache;
    }

    public async Task<BinlistResponseDto?> GetBinInfoAsync(string bin)
    {
        string cacheKey = $"bin_info_{bin}";
        if (_cache.TryGetValue(cacheKey, out BinlistResponseDto? cachedResponse))
        {
            _logger.LogInformation("Serving BIN {Bin} from cache", bin);
            return cachedResponse;
        }

        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, bin);
            request.Headers.Add("Accept-Version", "3");

            var response = await _httpClient.SendAsync(request);

            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                return null;

            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<BinlistResponseDto>();

            if (result != null)
            {
                _cache.Set(cacheKey, result, TimeSpan.FromMinutes(30));
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Binlist API communication error for BIN: {Bin}", bin);
            return null;
        }
    }
}
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;
using Whisper.Application.Common.Config;
using Whisper.Application.DTOs.EmojiDTOs;
using Whisper.Application.DTOs.GifsDTOs;
using Whisper.Application.Interfaces.Services;

namespace Whisper.Application.Services
{
    public class KlipyService : IGifsService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<KlipyService> _logger;
        private readonly IMemoryCache _cache;
        private KlipyApiSettings _options;
        public KlipyService(HttpClient httpClient, ILogger<KlipyService> logger, IOptions<KlipyApiSettings> options, IMemoryCache cache)
        {
            _httpClient = httpClient;
            _logger = logger;
            _options = options.Value;
            _cache = cache;
        }
        public async Task<GifResponseDto?> GetTrendingAsync()
        {
            string cacheKey = "klipy_get-trending";
            try
            {
                if (_cache.TryGetValue(cacheKey, out GifResponseDto cachedResponse))
                    return cachedResponse;

                string queries = "format_filter=gif";
                var response = await _httpClient.GetAsync($"/api/v1/{_options.ApiKey}/gifs/trending?" + queries);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Couldn't fetch response from api.klipy.com.");
                    return null;
                }
                var result = response.Content.ReadFromJsonAsync<GifResponseDto>().Result;
                if (result != null)
                    _cache.Set(cacheKey, result, TimeSpan.FromMinutes(15));
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogWarning("api.klipy.com is not accesible." + ex);
                return null;
            }
        }

        public async Task<GifResponseDto?> GetBySearchAsync(string query)
        {
            string cacheKey = $"klipy_get-search-{query}";
            try
            {
                if (_cache.TryGetValue(cacheKey, out GifResponseDto cachedResponse))
                    return cachedResponse;

                string queries = "format_filter=gif" + $"&q={query}";
                var response = await _httpClient.GetAsync($"/api/v1/{_options.ApiKey}/gifs/search?" + queries);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Couldn't fetch response from api.klipy.com.");
                    return null;
                }
                var result = response.Content.ReadFromJsonAsync<GifResponseDto>().Result;
                if (result != null)
                    _cache.Set(cacheKey, result, TimeSpan.FromMinutes(30));
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogWarning("api.klipy.com is not accesible." + ex);
                return null;
            }
        }
    }
}

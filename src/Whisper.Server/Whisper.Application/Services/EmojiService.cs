using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;
using Whisper.Application.Common.Config;
using Whisper.Application.DTOs.EmojiDTOs;
using Whisper.Application.Interfaces.Services;

namespace Whisper.Application.Services
{
    public class EmojiService : IEmojiService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<EmojiService> _logger;
        private readonly IMemoryCache _cache;
        private EmojiApiSettings _options;
        public EmojiService(HttpClient httpClient, ILogger<EmojiService> logger, IOptions<EmojiApiSettings>options, IMemoryCache cache)
        {
            _httpClient = httpClient;
            _logger = logger;
            _options = options.Value;
            _cache = cache;
        }

        public async Task<IEnumerable<EmojiDto>?> GetAll()
        {
            string cacheKey = "emoji_get-all";
            try
            {
                if (_cache.TryGetValue(cacheKey, out IEnumerable<EmojiDto> cachedResponse))
                    return cachedResponse;

                string queries = $"access_key={_options.ApiKey}";
                var response = await _httpClient.GetAsync("emojis?" + queries);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Couldn't fetch response from emoji-api.com.");
                    return null;
                }
                var result = response.Content.ReadFromJsonAsync<IEnumerable<EmojiDto>>().Result;
                if (result != null)
                    _cache.Set(cacheKey, result, TimeSpan.FromMinutes(30));
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Emoji-Api is not accesible.");
                return null;
            }
        }

        public async Task<IEnumerable<EmojiDto>?> GetBySearch(string query)
        {
            string cacheKey = $"emoji_get-{query}";
            try
            {
                if (_cache.TryGetValue(cacheKey, out IEnumerable<EmojiDto> cachedResponse))
                    return cachedResponse;

                string queries = $"access_key={_options.ApiKey}&" +
                                $"search={query}";
                var response = await _httpClient.GetAsync("emojis?" + queries);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Couldn't fetch response from emoji-api.com.");
                    return null;
                }
                var result = response.Content.ReadFromJsonAsync<IEnumerable<EmojiDto>>().Result;
                if (result != null)
                    _cache.Set(cacheKey, result, TimeSpan.FromMinutes(30));
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex + "Emoji-Api is not accesible.");
                return null;
            }
        }
    }
}

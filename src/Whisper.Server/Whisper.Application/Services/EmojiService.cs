using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Whisper.Application.Common.Config;
using Whisper.Application.DTOs.EmojiDTOs;
using Whisper.Application.Interfaces.Services;

namespace Whisper.Application.Services
{
    public class EmojiService : IEmojiService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<EmojiService> _logger;
        private EmojiApiSettings _options;
        public EmojiService(HttpClient httpClient, ILogger<EmojiService> logger, EmojiApiSettings options)
        {
            _httpClient = httpClient;
            _logger = logger;
            _options = options;
        }

        public async Task<IEnumerable<EmojiDto>?> GetAll()
        {
            try
            {
                string queries = $"access_key={_options.ApiKey}";
                var response = await _httpClient.GetAsync("emojis?" + queries);
                if (response.IsSuccessStatusCode)
                {
                    string result = response.Content.ReadAsStringAsync().Result;
                    return JsonConvert.DeserializeObject<IEnumerable<EmojiDto>>(result);
                }
                else
                {

                    throw new Exception("Couldn't fetch response from emoji-api.com.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex + "Emoji-Api is not accesible.");
                return null;
            }
        }

        public async Task<IEnumerable<EmojiDto>?> GetBySearch(string query)
        {
            try
            {
                string queries = $"access_key={_options.ApiKey}&" +
                                $"search={query}";
                var response = await _httpClient.GetAsync("emojis?" + queries);
                if (response.IsSuccessStatusCode)
                {
                    string result = response.Content.ReadAsStringAsync().Result;
                    return JsonConvert.DeserializeObject<IEnumerable<EmojiDto>>(result);
                }
                else
                {
                    throw new Exception("Couldn't fetch response from emoji-api.com.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex + "Emoji-Api is not accesible.");
                return null;
            }
        }
    }
}

using System.Text.Json.Serialization;

namespace Whisper.Application.Common.Config
{
    public class KlipyApiSettings
    {
        [JsonPropertyName("BaseLink")]
        public string BaseLink { get; set; }
        [JsonPropertyName("ApiKey")]
        public string ApiKey { get; set; }
    }
}

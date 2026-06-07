using System.Text.Json.Serialization;

namespace Whisper.Application.DTOs.GifsDTOs
{
    public class GifInstanceDto
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }
        [JsonPropertyName("slug")]
        public string Slug { get; set; }
        [JsonPropertyName("title")]
        public string Title { get; set; }
        [JsonPropertyName("file")]
        public GifFileDto File { get; set; }
    }
}

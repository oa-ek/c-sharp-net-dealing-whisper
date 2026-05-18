using System.Text.Json.Serialization;

namespace Whisper.Application.DTOs.GifsDTOs
{
    public class GifDataDto
    {
        [JsonPropertyName("data")]
        public IEnumerable<GifInstanceDto> Data { get; set; }
        [JsonPropertyName("current_page")]
        public int CurrentPage { get; set; }
        [JsonPropertyName("per_page")]
        public int PerPage { get; set; }
        [JsonPropertyName("has_next")]
        public bool HasNext { get; set; }
    }
}

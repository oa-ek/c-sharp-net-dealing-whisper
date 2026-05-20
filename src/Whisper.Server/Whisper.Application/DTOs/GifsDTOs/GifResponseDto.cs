using System.Text.Json.Serialization;

namespace Whisper.Application.DTOs.GifsDTOs
{
    public class GifResponseDto
    {
        [JsonPropertyName("result")]
        public bool Result { get; set; }
        [JsonPropertyName("data")]
        public GifDataDto Data { get; set; }
    }
}

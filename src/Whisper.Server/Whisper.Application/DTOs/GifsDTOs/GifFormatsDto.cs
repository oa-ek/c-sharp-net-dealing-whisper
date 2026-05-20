using System.Text.Json.Serialization;

namespace Whisper.Application.DTOs.GifsDTOs
{
    public class GifFormatsDto
    {
        [JsonPropertyName("gif")]
        public GifDto Gif { get; set; }
    }
}

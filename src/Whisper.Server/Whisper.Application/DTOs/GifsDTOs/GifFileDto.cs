using System.Text.Json.Serialization;

namespace Whisper.Application.DTOs.GifsDTOs
{
    public class GifFileDto
    {
        [JsonPropertyName("hd")]
        public GifFormatsDto HdSize { get; set; }
        [JsonPropertyName("md")]
        public GifFormatsDto MdSize { get; set; }
        [JsonPropertyName("sm")]
        public GifFormatsDto SmSize { get; set; }
        [JsonPropertyName("xs")]
        public GifFormatsDto XsSize { get; set; }
    }
}

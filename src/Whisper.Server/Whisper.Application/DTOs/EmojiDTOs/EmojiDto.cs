using System.Text.Json.Serialization;

namespace Whisper.Application.DTOs.EmojiDTOs
{
    public class EmojiDto
    {
        [JsonPropertyName("slug")] public string Slug { get; set; }
        [JsonPropertyName("character")] public string Character { get; set; }
        [JsonPropertyName("unicodeName")] public string UnicodeName { get; set; }
        [JsonPropertyName("codePoint")] public string CodePoint { get; set; }
        [JsonPropertyName("group")] public string Group { get; set; }
        [JsonPropertyName("subGroup")] public string SubGroup { get; set; }
    }
}

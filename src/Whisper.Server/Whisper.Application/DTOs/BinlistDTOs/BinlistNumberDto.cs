using System.Text.Json.Serialization;

namespace Whisper.Application.DTOs.BinlistDTOs
{

    public class BinlistNumberDto
    {
        [JsonPropertyName("length")] public int Length { get; set; }
        [JsonPropertyName("luhn")] public bool Luhn { get; set; }
    }
}
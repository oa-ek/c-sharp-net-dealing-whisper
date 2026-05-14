using System.Text.Json.Serialization;

namespace Whisper.Application.DTOs.BinlistDTOs
{

    public class BinlistCountryDto
    {
        [JsonPropertyName("numeric")] public string Numeric { get; set; }
        [JsonPropertyName("alpha2")] public string Alpha2 { get; set; }
        [JsonPropertyName("name")] public string Name { get; set; }
        [JsonPropertyName("emoji")] public string Emoji { get; set; }
        [JsonPropertyName("currency")] public string Currency { get; set; }
        [JsonPropertyName("latitude")] public double Latitude { get; set; }
        [JsonPropertyName("longitude")] public double Longitude { get; set; }
    }
}
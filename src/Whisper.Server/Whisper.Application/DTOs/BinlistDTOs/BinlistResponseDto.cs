using System.Text.Json.Serialization;

namespace Whisper.Application.DTOs.BinlistDTOs
{
    public class BinlistResponseDto
    {
        [JsonPropertyName("number")] public BinlistNumberDto Number { get; set; }
        [JsonPropertyName("scheme")] public string Scheme { get; set; }
        [JsonPropertyName("type")] public string Type { get; set; }
        [JsonPropertyName("brand")] public string Brand { get; set; }
        [JsonPropertyName("prepaid")] public bool Prepaid { get; set; } // Нове поле
        [JsonPropertyName("country")] public BinlistCountryDto Country { get; set; }
        [JsonPropertyName("bank")] public BinlistBankDto Bank { get; set; }
    }
}


namespace Whisper.Application.DTOs.KeyDTOs
{
    public class BundleDto
    {
        public string DeviceId { get; set; }
        public string PublicIdentityKey { get; set; }
        public string SignedPreKey { get; set; }
        public string SignedPreKeySignature { get; set; }
        public string OneTimePreKeyId { get; set; }
        public string OneTimePreKey { get; set; }
    }
}

namespace Whisper.Application.Interfaces.Services
{
    public interface IOnlineTracker
    {
        void TrackConnection(string userId, string connectionId);
        void TrackDisconnection(string connectionId);
        int GetOnlineCount();
        IEnumerable<string> GetOnlineUserIds();
    }
}
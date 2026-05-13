using System.Collections.Concurrent;

namespace Whisper.Application.Interfaces.Services
{
    public class OnlineTracker : IOnlineTracker
    {
        private readonly ConcurrentDictionary<string, string> _connections = new();

        public void TrackConnection(string userId, string connectionId) => 
            _connections.TryAdd(connectionId, userId);

        public void TrackDisconnection(string connectionId) => 
            _connections.TryRemove(connectionId, out _);

        public int GetOnlineCount() => 
            _connections.Values.Distinct().Count();

        public IEnumerable<string> GetOnlineUserIds() => 
            _connections.Values.Distinct();
    }
}
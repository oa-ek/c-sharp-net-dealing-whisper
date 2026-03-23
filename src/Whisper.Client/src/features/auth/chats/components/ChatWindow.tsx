interface Props { onToggleInfo: () => void; }

export const ChatWindow = ({ onToggleInfo }: Props) => {
  return (
    <div className="flex-1 flex flex-col bg-[#080808]">
      {/* Chat Header */}
      <div className="h-16 border-b border-zinc-900 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-800 rounded-full" />
          <div>
            <h3 className="text-sm font-bold">Alex Rivera</h3>
            <p className="text-[10px] text-green-500">Typing...</p>
          </div>
        </div>
        <button 
          onClick={onToggleInfo}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </button>
      </div>

      {/* Messages Area (Placeholder) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Тут будуть повідомлення */}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#050505]">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2">
          <input 
            type="text" 
            placeholder="Write a message..." 
            className="flex-1 bg-transparent border-none focus:outline-none text-sm"
          />
          <button className="text-zinc-400 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
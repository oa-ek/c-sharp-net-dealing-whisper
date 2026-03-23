export const ChatSidebar = () => {
  return (
    <div className="w-80 border-r border-zinc-900 flex flex-col relative">
      <div className="p-4">
        <input 
          type="text" 
          placeholder="Search conversations..." 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-zinc-700 transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {/* Рендеримо масив чатів (заглушки) */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 hover:bg-zinc-900 rounded-2xl cursor-pointer transition-all mb-1">
            <div className="w-12 h-12 bg-zinc-800 rounded-full shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-sm truncate">User Name {i}</h4>
                <span className="text-[10px] text-zinc-600">10:24 AM</span>
              </div>
              <p className="text-xs text-zinc-500 truncate">Let's review the final deck at 3PM.</p>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button (FAB) */}
      <button className="absolute bottom-6 right-6 w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-10">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </div>
  );
};
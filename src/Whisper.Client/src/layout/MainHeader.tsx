export const MainHeader = () => {
  return (
    <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-6 bg-[#050505]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <span className="text-black font-black text-xl">W</span>
        </div>
        <span className="font-black tracking-tighter text-lg uppercase">Whisper</span>
      </div>

      <div className="group relative flex items-center gap-3 cursor-pointer p-2 hover:bg-zinc-900 rounded-xl transition-all">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold">Chicago</p>
          <p className="text-[10px] text-zinc-500">Available</p>
        </div>
        <div className="w-10 h-10 bg-zinc-800 rounded-full border border-zinc-700" />
        
        {/* Dropdown Menu (Заглушка) */}
        <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <div className="p-2 space-y-1">
            <button className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-800 rounded-lg">Edit Profile</button>
            <button className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-800 rounded-lg">Settings</button>
            <div className="h-[1px] bg-zinc-800 my-1" />
            <button className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg font-bold">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
};
const ChatsPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-4 text-center">
        <div className="inline-block px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
          Secure Session Active
        </div>
        <h1 className="text-3xl font-black tracking-tighter">WHISPER CHATS</h1>
        <p className="text-zinc-500 text-sm">
          Welcome back. Your end-to-end encrypted environment is ready.
        </p>
        <div className="h-[1px] w-full bg-zinc-900 my-8" />
        <button 
          onClick={() => window.location.href = '/auth/login'}
          className="text-xs text-zinc-600 hover:text-white transition-colors"
        >
          Logout & Destroy Keys
        </button>
      </div>
    </div>
  );
};

export default ChatsPage;
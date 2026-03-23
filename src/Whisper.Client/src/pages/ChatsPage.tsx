import { useState } from 'react';
import { MainHeader } from '../layout/MainHeader';
import { ChatSidebar } from '../features/auth/chats/components/ChatSidebar';
import { ChatWindow } from '../features/auth/chats/components/ChatWindow';

const ChatsPage = () => {
  // Стан для відкриття/закриття правої панелі інфо
  const [isInfoOpen, setIsInfoOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-white font-[Geist] overflow-hidden">
      {/* Хедер з src/layout/MainHeader.tsx */}
      <MainHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Список чатів (Sidebar) */}
        <ChatSidebar />

        {/* Вікно чату (Center) */}
        <ChatWindow onToggleInfo={() => setIsInfoOpen(!isInfoOpen)} />

        {/* Панель інформації (Right) */}
        {isInfoOpen && (
          <aside className="w-80 border-l border-zinc-900 bg-[#050505] hidden lg:flex flex-col p-8 items-center animate-in slide-in-from-right duration-300">
            <div className="w-32 h-32 bg-zinc-800 rounded-full mb-6 border border-zinc-700 shadow-2xl" />
            
            <h2 className="text-xl font-black uppercase tracking-tighter mb-1">Alex Rivera</h2>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-8 text-blue-500">
              Product Designer
            </p>

            <div className="w-full h-[1px] bg-zinc-900 mb-8" />

            <div className="w-full space-y-6 text-left">
              <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase mb-2">Contact Info</p>
                <p className="text-xs text-zinc-400">alex.rivera@nexus.corp</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase mb-2">Bio</p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Loves clean UIs, dark mode, and morning coffee. Let's build something secure.
                </p>
              </div>
            </div>

            <button className="mt-auto w-full py-3 border border-red-500/20 text-red-500 text-[10px] font-black uppercase rounded-xl hover:bg-red-500/10 transition-all">
              Block Contact
            </button>
          </aside>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;
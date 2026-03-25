import { SendHorizonal, Info, MoreVertical, Smile, Paperclip } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { ScrollArea } from "../../../../components/ui/scroll-area";

interface ChatWindowProps {
  activeChatId?: string;
  onShowInfo: () => void;
}

export const ChatWindow = ({ activeChatId, onShowInfo }: ChatWindowProps) => {
  if (!activeChatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#111111] opacity-40">
        <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase">Whisper Secure Connect</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#111111]">
      {/* Header */}
      <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#141414]/90 backdrop-blur-sm">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={onShowInfo}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-zinc-700 group-hover:border-emerald-500/50 transition-all">
              ID
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#141414]" />
          </div>
          <div>
            <span className="text-zinc-200 font-medium block group-hover:text-white transition-colors">Illia Davidyuk</span>
            <span className="text-[10px] text-emerald-500 font-bold tracking-tighter uppercase">online</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onShowInfo}
            className="text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 focus-visible:ring-0"
          >
            <Info className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-start">
            <div className="bg-zinc-900/60 border border-zinc-800 text-zinc-300 p-3.5 rounded-2xl rounded-tl-none max-w-[70%] text-sm leading-relaxed shadow-sm">
              Привіт! Як успіхи з контролером чатів?
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-emerald-600/10 border border-emerald-500/30 text-emerald-50 p-3.5 rounded-2xl rounded-tr-none max-w-[70%] text-sm leading-relaxed shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              Привіт! Зараз закінчую логіку створення чатів і кидаю тобі код.
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 bg-[#111111] border-t border-zinc-900/50">
        <div className="max-w-3xl mx-auto flex gap-2 items-center bg-zinc-900/40 p-1.5 rounded-2xl border border-zinc-800 focus-within:border-emerald-500/40 transition-all duration-300">
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-emerald-500 hover:bg-transparent"><Paperclip className="w-5 h-5" /></Button>
          <Input 
            className="border-none bg-transparent focus-visible:ring-0 text-zinc-200 placeholder:text-zinc-600 text-sm h-10" 
            placeholder="Напишіть повідомлення..." 
          />
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-emerald-500 hover:bg-transparent"><Smile className="w-5 h-5" /></Button>
          <Button size="icon" className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white w-10 h-10 shadow-lg shadow-emerald-900/20 active:scale-95 transition-all">
            <SendHorizonal className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
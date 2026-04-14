import { useState, useEffect, useRef } from "react";
import { SendHorizonal, Info, Paperclip, Smile } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";

interface ChatWindowProps {
  activeChatId?: string;
  activeChatName?: string;
  onShowInfo: () => void;
  messages: any[]; 
  onSendMessage: (content: string) => void;
  currentUserId: string | null;
}

export const ChatWindow = ({ 
  activeChatId, 
  activeChatName, 
  onShowInfo, 
  messages, 
  onSendMessage,
  currentUserId 
}: ChatWindowProps) => {
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  if (!activeChatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#111111] opacity-50 h-full">
        <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase">Whisper Secure</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#111111] h-full overflow-hidden">
      
      <div className="h-16 flex-none border-b border-zinc-800 flex items-center justify-between px-6 bg-[#141414] z-10">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onShowInfo}>
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold uppercase border border-zinc-700">
            {activeChatName ? activeChatName[0] : "?"}
          </div>
          <div>
            <span className="text-zinc-200 font-medium block group-hover:text-emerald-400 transition-colors">
              {activeChatName}
            </span>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Connected</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onShowInfo} className="text-zinc-400 hover:text-emerald-400">
          <Info className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 min-h-0 relative">
        <ScrollArea ref={scrollRef} className="h-full w-full">
          <div className="p-6 space-y-4 max-w-3xl mx-auto">
            {messages
              .filter(msg => !msg.ciphertext.startsWith("#InitCode"))
              .map((msg: any) => {
                const isMine = msg.senderId === currentUserId;

              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isMine ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`p-3.5 rounded-2xl max-w-[75%] text-sm shadow-sm ${
                    isMine 
                      ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-50 rounded-tr-none" 
                      : "bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none"
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap break-words">
                      {msg.ciphertext || "Порожнє повідомлення"}
                    </p>
                    <span className="text-[9px] block mt-1 opacity-40 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-none p-4 bg-[#111111] border-t border-zinc-900/50">
        <div className="max-w-3xl mx-auto flex gap-2 items-center bg-zinc-900/40 p-1.5 rounded-2xl border border-zinc-800 focus-within:border-emerald-500/40 transition-all shadow-inner">
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-300">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="border-none bg-transparent focus-visible:ring-0 text-zinc-200 placeholder:text-zinc-600" 
            placeholder="Напишіть повідомлення..." 
          />
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-300">
            <Smile className="w-5 h-5" />
          </Button>
          <Button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            size="icon" 
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white w-10 h-10 shadow-lg active:scale-95 transition-all"
          >
            <SendHorizonal className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
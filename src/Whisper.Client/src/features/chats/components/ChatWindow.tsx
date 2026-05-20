import { useState, useEffect, useRef } from "react";
import { SendHorizonal, Info, Paperclip, Smile, SquarePlay } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";
import chatSocketService from "../../../services/ChatSocketService";
import { EmojiModal } from "./EmojiModal";
import { CardPreview } from "./CardPreview";
import { GifsModal } from "./GifsModal";

interface ChatWindowProps {
  activeChatId?: string;
  activeChatName?: string;
  onShowInfo: () => void;
  messages: any[]; 
  onSendMessage: (content: string) => void;
  currentUserId: string | null;
  isPartnerTyping: boolean; 
}

const mediaFileExtensions = [
  '.gif', 
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
]
const renderMessageWithCards = (text: string) => {
  const cardRegex = /(\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b)/g;
  
  if (!text) return null;

  const parts = text.split(cardRegex);
  
  return parts.map((part, index) => {
    if (part.match(cardRegex)) {
      return <CardPreview key={index} cardNumber={part} />;
    }
    return part;
  });
};

export const ChatWindow = ({ 
  activeChatId, 
  activeChatName, 
  onShowInfo, 
  messages, 
  onSendMessage,
  currentUserId,
  isPartnerTyping 
}: ChatWindowProps) => {
  const [inputText, setInputText] = useState("");
  const [isLocalTyping, setIsLocalTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState<boolean>(false);
  const [isGifsModalOpen, setIsGifsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!activeChatId || !inputText.trim()) {
      if (isLocalTyping) {
        chatSocketService.stopTyping(activeChatId!);
        setIsLocalTyping(false);
      }
      return;
    }

    if (!isLocalTyping) {
      chatSocketService.startTyping(activeChatId);
      setIsLocalTyping(true);
    }

    const timeout = setTimeout(() => {
      chatSocketService.stopTyping(activeChatId);
      setIsLocalTyping(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [inputText, activeChatId]);

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
  }, [messages, isPartnerTyping]); 

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
    if (activeChatId) chatSocketService.stopTyping(activeChatId);
    setIsLocalTyping(false);
  };

  if (!activeChatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f9fafb] h-full">
        <p className="text-gray-400 text-[10px] tracking-[0.5em] font-black uppercase opacity-50">
          Whisper Secure
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#f9fafb] h-full overflow-hidden">
      
      {/* Header */}
      <div className="h-16 flex-none border-b border-gray-100 flex items-center justify-between px-6 bg-white z-10 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onShowInfo}>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 font-black uppercase border border-gray-100 group-hover:border-[#348F96] transition-all duration-300">
            {activeChatName ? activeChatName[0] : "?"}
          </div>
          <div>
            <span className="text-[#111] font-bold block transition-colors group-hover:text-[#2D6BA3]">
              {activeChatName}
            </span>
            {isPartnerTyping ? (
                <span className="text-[10px] text-[#348F96] font-black animate-pulse uppercase tracking-widest">
                  Друкує...
                </span>
            ) : (
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                  Connected
                </span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onShowInfo} className="text-gray-400 hover:text-[#2D6BA3] hover:bg-blue-50 rounded-xl transition-all">
          <Info className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 relative">
        <ScrollArea ref={scrollRef} className="h-full w-full">
          <div className="p-6 space-y-4 max-w-3xl mx-auto">
            {messages.map((msg: any) => {
                const isMine = msg.senderId === currentUserId;
                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isMine ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div className={`p-4 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                      isMine 
                        ? "bg-linear-[135deg] from-[#64B59D] via-[#348F96] to-[#2D6BA3] text-white rounded-tr-none font-medium shadow-blue-900/5" 
                        : "bg-white border border-gray-100 text-[#222] rounded-tl-none"
                    }`}>
                      <div>
                        {
                      mediaFileExtensions.some(e => msg.ciphertext.endsWith(e)) ? ( 
                      <img src={msg.ciphertext} className="max-w-md h-auto"/>
                        ) : (
                        <p className="leading-relaxed whitespace-pre-wrap break-words">
                        {renderMessageWithCards(msg.ciphertext)}
                      </p>
                        )
                      }
                      </div>

                      
                      <div className={`text-[9px] mt-1.5 font-bold uppercase tracking-tighter text-right opacity-60 ${isMine ? "text-white" : "text-gray-400"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
            })}

            {/* Typing Dots з новими кольорами */}
            {isPartnerTyping && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center shadow-sm">
                  <span className="w-1.5 h-1.5 bg-[#64B59D] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#348F96] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#2D6BA3] rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto flex gap-1 items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-200 focus-within:border-[#348F96]/40 focus-within:ring-4 focus-within:ring-[#348F96]/5 transition-all duration-300">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#348F96] rounded-xl transition-colors">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="border-none bg-transparent focus-visible:ring-0 text-[#111] placeholder:text-gray-400 font-medium" 
            placeholder="Напишіть повідомлення..." 
          />
          <Button onClick={() => {setIsGifsModalOpen(!isGifsModalOpen); setIsEmojiModalOpen(false); }} variant="ghost" size="icon" className="text-gray-400 hover:text-[#348F96] rounded-xl transition-colors -mr-2">
            <SquarePlay className="w-5 h-5" />
          </Button>
          <div className="relative">
              <div className="absolute bottom-10 -left-[448px]">
                <GifsModal 
                isOpen={isGifsModalOpen}
                onSelect={(gifLink: string) => {
                  setIsGifsModalOpen(false);
                  if (gifLink.length !== 0 && gifLink.endsWith(".gif"))
                  onSendMessage(gifLink);
                  handleSend();
                }} 
                />
              </div>
            </div>
          <Button onClick={() => {setIsEmojiModalOpen(!isEmojiModalOpen); setIsGifsModalOpen(false);}} variant="ghost" size="icon" className="text-gray-400 hover:text-[#348F96] rounded-xl transition-colors">
            <Smile className="w-5 h-5" />
          </Button>
          <div className="relative">
              <div className="absolute bottom-10 -left-[448px]">
                <EmojiModal 
                isOpen={isEmojiModalOpen}
                onSelect={(emoji: String) => {
                  setIsEmojiModalOpen(false);
                  setInputText(inputText + emoji);
                }} 
                />
              </div>
            </div>
          <Button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            size="icon" 
            className="rounded-xl bg-gradient-to-r from-[#64B59D] via-[#348F96] to-[#2D6BA3] hover:opacity-90 disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-400 text-white w-10 h-10 shadow-md active:scale-95 transition-all duration-300 border-none"
          >
            <SendHorizonal className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
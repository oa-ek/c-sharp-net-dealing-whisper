import { useState, useEffect, useRef } from "react";
import { SendHorizonal, Info, Paperclip, Smile, SquarePlay, Trash, FileText, Loader2, X} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";
import chatSocketService from "../../../services/ChatSocketService";
import { EmojiModal } from "./EmojiModal";
import { CardPreview } from "./CardPreview";
import { GifsModal } from "./GifsModal";
import type { ChatDto } from "../../../types/chat";
import type { UserDto } from "../../../types/user";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import agent from "../../../api/agent";
import { db } from "../../../api/db";
import { SecureAttachment } from "../components/SecureAttachments";

interface ChatWindowProps {
  activeChat: ChatDto;
  onShowInfo: () => void;
  messages: any[]; 
  onSendMessage: (content: string, attachments?: any[]) => void;
  onChatRemoval: () => void;
  currentUserId: string | null;
  isPartnerTyping: boolean; 
  activeChatMembers?: UserDto[];
}

const mediaFileExtensions = [
  '.gif', 
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
]

const mapAttachmentsForSignalR = (attachments: any[]) => {
  return attachments.map(f => {
    const id = f?.attachmentId || f?.AttachmentId || f?.id || f?.Id || f?._id;
    return {
      attachmentId: id, name: f?.name || f?.Name, url: f?.url || f?.Url, contentType: f?.contentType || f?.ContentType, size: f?.size || f?.Size,
      AttachmentId: id, Name: f?.name || f?.Name, Url: f?.url || f?.Url, ContentType: f?.contentType || f?.ContentType, Size: f?.size || f?.Size
    };
  });
};

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
  activeChat, 
  onShowInfo, 
  messages, 
  onSendMessage,
  onChatRemoval,
  currentUserId,
  isPartnerTyping,
  activeChatMembers
}: ChatWindowProps) => {
  const [inputText, setInputText] = useState("");
  const [isLocalTyping, setIsLocalTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState<boolean>(false);
  const [isGifsModalOpen, setIsGifsModalOpen] = useState<boolean>(false);
  const [chatDisplayName, setChatDisplayName] = useState<string>();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingAttachments, setPendingAttachments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (!activeChat.id || (!inputText.trim() && pendingAttachments.length === 0)) {
      if (isLocalTyping) {
        chatSocketService.stopTyping(activeChat.id);
        setIsLocalTyping(false);
      }
      return;
    }

    if (!isLocalTyping) {
      chatSocketService.startTyping(activeChat.id);
      setIsLocalTyping(true);
    }

    const timeout = setTimeout(() => {
      chatSocketService.stopTyping(activeChat.id);
      setIsLocalTyping(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [inputText, pendingAttachments, activeChat.id]);

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
    if (!inputText.trim() && pendingAttachments.length === 0) return;
    onSendMessage(inputText.trim(), mapAttachmentsForSignalR(pendingAttachments));
    setInputText("");
    setPendingAttachments([]);
    if (activeChat.id) chatSocketService.stopTyping(activeChat.id);
    setIsLocalTyping(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploadedFiles: any[] = [];
      for (let i = 0; i < files.length; i++) {
        const response = await agent.Media.upload(files[i]);
        const fileData = response.data || response;
        uploadedFiles.push(fileData);
      }
      setPendingAttachments((prev) => [...prev, ...uploadedFiles]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Помилка завантаження файлу:", err);
      alert("Не вдалося завантажити медіа файл.");
    } finally { setIsUploading(false); }
  };

  useEffect(() => {
    const chatMember = activeChatMembers ? activeChatMembers?.find((member) => member.id != currentUserId) : null; 
    setChatDisplayName(activeChat.isGroup ?
      activeChat.name :
      chatMember ?
        chatMember?.displayName ?
          chatMember?.displayName :
          chatMember?.username :
        "?")
  }, [activeChat])

  if (!activeChat.id) {
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
            {chatDisplayName ? chatDisplayName[0] : "?" }
          </div>
          <div>
            <span className="text-[#111] font-bold block transition-colors group-hover:text-[#2D6BA3]">
              { chatDisplayName }
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
        <div>
          <Button variant="ghost" size="icon" onClick={() => setIsConfirmModalOpen(true)} className="text-gray-400 hover:text-[#A32D2D] hover:bg-red-50 rounded-xl transition-all">
            <Trash className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onShowInfo} className="text-gray-400 hover:text-[#2D6BA3] hover:bg-blue-50 rounded-xl transition-all">
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onSelect={(answer: boolean) => {
          if (answer) onChatRemoval()
          setIsConfirmModalOpen(false)
        }}
        title="Видалити чат?"
        details={`Видалення чату з користувачем ${chatDisplayName} є незворотньою дією. Ви впевнені?`}
      />

      {/* Messages Area */}
      <div className="flex-1 min-h-0 relative">
        <ScrollArea ref={scrollRef} className="h-full w-full">
          <div className="p-6 space-y-4 max-w-3xl mx-auto">
            {messages.map((msg: any) => {
                const isMine = msg.senderId === currentUserId;
                const attachmentsList = msg.attachments || msg.Attachments;
                const hasAttachments = attachmentsList && attachmentsList.length > 0;
                
                const isTextEmptyOrPlaceholder = !msg.ciphertext || msg.ciphertext === "..." || msg.ciphertext.startsWith("#Init");
                const shouldRenderTextBubble = !isTextEmptyOrPlaceholder || (!hasAttachments && !msg.ciphertext?.startsWith("#Init"));

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
                      {shouldRenderTextBubble && (
                        <div>
                          {mediaFileExtensions.some(e => msg.ciphertext.endsWith(e)) && !hasAttachments ? ( 
                            <img src={msg.ciphertext} className="max-w-md h-auto rounded-lg shadow-sm"/>
                          ) : (
                            <p className="leading-relaxed whitespace-pre-wrap break-words">
                              {renderMessageWithCards(msg.ciphertext)}
                            </p>
                          )}
                        </div>
                      )}

                      {hasAttachments && (
                        <div className={`${shouldRenderTextBubble ? 'mt-2' : ''} space-y-2 flex flex-col`}>
                          {attachmentsList.map((file: any, index: number) => (
                            <SecureAttachment 
                              key={file?.attachmentId || file?.AttachmentId || file?._id || index} 
                              file={file} 
                              isMine={isMine} 
                            />
                          ))}
                        </div>
                      )}

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
      <div className="flex-none p-4 bg-white border-t border-gray-100 flex flex-col gap-2">
        {pendingAttachments.length > 0 && (
          <div className="max-w-3xl mx-auto w-full flex flex-wrap gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200 max-h-24 overflow-y-auto">
            {pendingAttachments.map((file, idx) => (
              <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 text-gray-700 rounded-lg text-xs font-bold shadow-sm">
                <FileText className="w-3.5 h-3.5 text-[#348F96]" />
                <span className="truncate max-w-[120px]">{file?.name || file?.Name || "Файл"}</span>
                <button onClick={() => setPendingAttachments(prev => prev.filter((_, i) => i !== idx))} className="p-0.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="max-w-3xl mx-auto w-full flex gap-1 items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-200 focus-within:border-[#348F96]/40 focus-within:ring-4 focus-within:ring-[#348F96]/5 transition-all duration-300">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
          <Button onClick={() => !isUploading && fileInputRef.current?.click()} variant="ghost" size="icon" className="text-gray-400 hover:text-[#348F96] rounded-xl transition-colors" disabled={isUploading}>
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-[#348F96]" /> : <Paperclip className="w-5 h-5" />}
          </Button>
          <Input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="border-none bg-transparent focus-visible:ring-0 text-[#111] placeholder:text-gray-400 font-medium" 
            placeholder={isUploading ? "Медіа завантажується..." : "Напишіть повідомлення..."} 
            disabled={isUploading}
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
            disabled={(!inputText.trim() && pendingAttachments.length === 0) || isUploading}
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
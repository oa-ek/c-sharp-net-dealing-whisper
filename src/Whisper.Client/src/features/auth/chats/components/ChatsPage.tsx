import { useState } from "react";
// Імпорт необхідних компонентів з shadcn/ui
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { Separator } from "../../../../components/ui/separator";
import { SendHorizonal, Plus, MoreVertical } from "lucide-react"; // Іконки

// Підключаємо логотип. Переконайся, що шлях вірний!
import logo from "../components/ui/WhisperLogo.ico";

// --- ФЕЙКОВІ ДАНІ (Моки) ---
const mockChats = [
  { id: 1, name: "Illia Davidyuk", fallback: "ID", lastMessage: "Yes, got the JWT fix.", time: "10:15", unread: 2 },
  { id: 2, name: "Team Whisper", fallback: "TW", lastMessage: "Demo is ready!", time: "09:50", unread: 0 },
  { id: 3, name: "Maria Petrenko", fallback: "MP", lastMessage: "Let's test the keys tomorrow.", time: "Yesterday", unread: 1 },
];

const mockMessages = [
  { id: 1, sender: "me", text: "Is the new SignalR middleware working?", time: "10:01" },
  { id: 2, sender: "illia", text: "Yes, I finally solved the 401 error.", time: "10:05" },
  { id: 3, sender: "illia", text: "The token is now correctly parsed from the query string.", time: "10:05" },
  { id: 4, sender: "me", text: "Great! Let's build the UI then.", time: "10:10" },
];

export const ChatsPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const selectedChat = mockChats.find(chat => chat.id === selectedChatId);

  return (
    <div className="flex h-screen bg-[#111111] text-neutral-200 antialiased">
      {/* 1. БОКОВА ПАНЕЛЬ ЧАТІВ */}
      <div className="w-1/4 h-screen border-r border-[#222222] flex flex-col bg-[#141414]">
        {/* Заголовок бокової панелі з логотипом */}
        <div className="p-4 border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Whisper Logo" className="w-9 h-9" />
            <h1 className="text-xl font-bold text-white tracking-tight">Whisper</h1>
          </div>
          <Button variant="ghost" size="icon" className="hover:bg-[#222222]">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Список чатів */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {mockChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                  selectedChatId === chat.id ? "bg-[#222222]" : "hover:bg-[#1a1a1a]"
                }`}
              >
                <Avatar className="w-11 h-11 border border-[#333333]">
                  <AvatarFallback className="bg-[#1a1a1a] text-neutral-400">{chat.fallback}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-sm ${selectedChatId === chat.id ? "text-white" : ""}`}>{chat.name}</h3>
                    <span className="text-xs text-neutral-500">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-neutral-400 truncate pr-4">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="bg-[#00e676] text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 2. ОСНОВНЕ ВІКНО ЧАТУ */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col h-screen">
          {/* Заголовок чату */}
          <div className="p-4 border-b border-[#222222] bg-[#141414] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback>{selectedChat.fallback}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-md font-bold text-white tracking-tight">{selectedChat.name}</h2>
                <span className="text-xs text-[#00e676]">online</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="hover:bg-[#222222]">
                <MoreVertical className="w-5 h-5 text-neutral-400" />
              </Button>
            </div>
          </div>

          {/* Область повідомлень */}
          <ScrollArea className="flex-1 p-6 bg-[#111111]">
            <div className="space-y-4 max-w-4xl mx-auto">
              {mockMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <Card className={`p-3 max-w-sm rounded-xl border-none ${
                    msg.sender === "me" ? "bg-[#222222] text-white" : "bg-[#141414] text-neutral-200"
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-[10px] text-neutral-500 block mt-1.5 text-right">{msg.time}</span>
                  </Card>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Панель вводу */}
          <div className="p-4 border-t border-[#222222] bg-[#141414]">
            <div className="max-w-4xl mx-auto flex items-center gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message... (Shift+Enter for newline)"
                className="flex-1 bg-[#1a1a1a] border-[#222222] focus:ring-[#00e676] text-sm"
              />
              <Button variant="default" className="bg-[#00e676] hover:bg-[#00c853] text-black rounded-full w-10 h-10 p-0">
                <SendHorizonal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Коли чат не вибрано
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[#111111]">
          <img src={logo} alt="Whisper Logo" className="w-16 h-16 opacity-30" />
          <p className="text-neutral-600 text-sm tracking-tight">Select a chat to start whispering</p>
        </div>
      )}
    </div>
  );
};
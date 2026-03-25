import { useState, useEffect } from "react";
import agent from "../api/agent";
import chatSocketService from "../services/ChatSocketService"; 
import { getAuthTokenFromDB } from "../api/db";
import { ChatSidebar } from "../features/auth/chats/components/ChatSidebar";
import { ChatWindow } from "../features/auth/chats/components/ChatWindow";
import { UserInfoSidebar } from "../features/auth/chats/components/UserInfoSidebar";

const ChatsPage = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
  const [showInfo, setShowInfo] = useState(false);

  const loadChats = async () => {
    try {
      const data = await agent.Chats.list();
      setChats(data);
    } catch (err) {
      console.error("Помилка списку чатів:", err);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

useEffect(() => {
  const connect = async () => {
    const token = await getAuthTokenFromDB();
    
    console.log("🛠️ Спроба підключення. Токен:", token ? "Знайдено (починається на " + token.substring(0, 10) + "...)" : "ВІДСУТНІЙ");

    if (token) {
      try {
        await chatSocketService.startConnection(token);
      } catch (err) {
        console.error("❌ SignalR Connection Error:", err);
      }
    } else {
      console.error("❌ Неможливо підключити сокети: немає токена. Перенаправлення на логін?");
    }
  };
  connect();

  return () => chatSocketService.offAll();
}, []);

  useEffect(() => {
    if (selectedChatId) {
      setMessages([]); 
      
      const syncChat = async () => {
        try {
          const history = await agent.Chats.messages(selectedChatId);
          setMessages(history);

          await chatSocketService.joinChat(selectedChatId);
        } catch (err) {
          console.error("Помилка синхронізації чату:", err);
        }
      };
      syncChat();
    }
  }, [selectedChatId]);

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId) return;

    const messageDto = {
      chatId: selectedChatId,
      ciphertext: content,
      wrappedKey: "none",
      attachments: []
    };

    try {
      await chatSocketService.sendMessage(messageDto);
      console.log("✅ Whisper: Message triggered via Socket");
    } catch (err) {
      console.error("❌ Whisper: Send error:", err);
    }
  };

  const activeChat = chats.find((c) => c.id === selectedChatId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black selection:bg-emerald-500/30">
      <ChatSidebar 
        chats={chats} 
        onSelectChat={(id) => setSelectedChatId(id)} 
        refreshChats={loadChats} 
      />
      
      <ChatWindow 
        activeChatId={selectedChatId} 
        activeChatName={activeChat?.name}
        messages={messages} 
        onShowInfo={() => setShowInfo(!showInfo)} 
        onSendMessage={handleSendMessage}
      />
      
      {showInfo && activeChat && (
        <UserInfoSidebar 
          user={{ 
            name: activeChat.name, 
            username: `@${activeChat.name.toLowerCase().replace(/\s+/g, '_')}` 
          }} 
          onClose={() => setShowInfo(false)} 
        />
      )}
    </div>
  );
};

export default ChatsPage;
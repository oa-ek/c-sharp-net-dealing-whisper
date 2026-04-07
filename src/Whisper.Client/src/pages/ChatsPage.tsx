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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 1. Завантаження списку чатів
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

  // 2. Ініціалізація сокетів та отримання свого ID з токена
  useEffect(() => {
    const connect = async () => {
      const token = await getAuthTokenFromDB();
      
      if (token) {
        // Витягуємо ID користувача з JWT токена
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setCurrentUserId(payload.nameid); // Твій ID на бекенді зазвичай NameIdentifier
        } catch (e) {
          console.error("Помилка парсингу токена", e);
        }

        try {
          await chatSocketService.startConnection(token);

          // СЛУХАЄМО НОВІ ПОВІДОМЛЕННЯ В РЕАЛЬНОМУ ЧАСІ
          chatSocketService.onMessageNew((newMsg) => {
            setMessages((prev) => {
              // Перевірка на дублікати та чи повідомлення з цього чату
              if (prev.some(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          });
        } catch (err) {
          console.error("❌ SignalR Connection Error:", err);
        }
      }
    };
    connect();

    return () => chatSocketService.offAll();
  }, []);

  // 3. Синхронізація при зміні чату
  useEffect(() => {
    if (selectedChatId) {
      setMessages([]); 
      
      const syncChat = async () => {
        try {
          const history = await agent.Chats.messages(selectedChatId);
          setMessages(history);

          // Заходимо в "кімнату" чату на сервері
          await chatSocketService.joinChat(selectedChatId);
        } catch (err) {
          console.error("Помилка синхронізації чату:", err);
        }
      };
      syncChat();
    }
  }, [selectedChatId]);

  // 4. Відправка повідомлення
  const handleSendMessage = async (content: string) => {
    if (!selectedChatId) return;

    const messageDto = {
      chatId: selectedChatId,
      ciphertext: content,
      wrappedKey: "none",
      attachments: []
    };

    try {
      // Відправляємо через сокет (Бекенд збереже в Mongo і розішле всім)
      await chatSocketService.sendMessage(messageDto);
      console.log("✅ Whisper: Message sent via Socket");
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
        currentUserId={currentUserId} // ПЕРЕДАЄМО ТВІЙ ID ДЛЯ РОЗНОСУ ПО СТОРОНАХ
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
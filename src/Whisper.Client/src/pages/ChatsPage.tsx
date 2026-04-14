import { useState, useEffect } from "react";
import agent from "../api/agent";
import chatSocketService from "../services/ChatSocketService"; 
import { getAuthTokenFromDB } from "../api/db";
import { ChatSidebar } from "../features/chats/components/ChatSidebar";
import { ChatWindow } from "../features/chats/components/ChatWindow";
import { UserInfoSidebar } from "../features/chats/components/UserInfoSidebar";

const ChatsPage = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
  const [showInfo, setShowInfo] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(payload.nameid);
    } catch (e) {
      console.error("Помилка парсингу токена", e);
    }

    try {
      await chatSocketService.startConnection(token);
      
      chatSocketService.onMessageNew((newMsg) => {
        setMessages((prev) => {
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      });

      if (selectedChatId) {
        await chatSocketService.joinChat(selectedChatId);
      }

    } catch (err) {
      console.error("SignalR Connection Error:", err);
    }
  };
  connect();

  return () => chatSocketService.offAll();
}, []);

useEffect(() => {
  if (!selectedChatId) return;

  setMessages([]);

  const syncChat = async () => {
    try {
      const history = await agent.Chats.messages(selectedChatId);
      setMessages(history);

      const waitForConnection = async (retries = 10): Promise<void> => {
        if (chatSocketService['isConnected']?.()) {  
          await chatSocketService.joinChat(selectedChatId);
        } else if (retries > 0) {
          await new Promise(r => setTimeout(r, 300));
          await waitForConnection(retries - 1);
        } else {
          console.warn("Сокет так і не підключився");
        }
      };

      await waitForConnection();
    } catch (err) {
      console.error("Помилка синхронізації чату:", err);
    }
  };

  syncChat();
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
      console.log("Whisper: Message sent via Socket");
    } catch (err) {
      console.error("Whisper: Send error:", err);
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
        currentUserId={currentUserId}
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
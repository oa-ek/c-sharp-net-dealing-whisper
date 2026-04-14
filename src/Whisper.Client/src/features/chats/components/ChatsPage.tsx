import { useState, useEffect } from "react";
import agent from "../../../api/agent";
import chatSocketService from "../../../services/ChatSocketService";
import { getAuthTokenFromDB } from "../../../api/db";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { UserInfoSidebar } from "./UserInfoSidebar";

const ChatsPage = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
  const [showInfo, setShowInfo] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const loadChats = async () => {
    const data = await agent.Chats.list();
    setChats(data);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [chatsData, userData] = await Promise.all([
          agent.Chats.list(),
          agent.Users.getMe()
        ]);
        setChats(chatsData);
        setCurrentUser(userData);
      } catch (err) {
        console.error("Помилка завантаження даних:", err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const connect = async () => {
      const token = await getAuthTokenFromDB();
      if (!token) return;

      try {
        await chatSocketService.startConnection(token);
        console.log("✅ Socket connected");

chatSocketService.onMessageNew(async (newMsg) => {
  await loadChats(); 
  
  setMessages((prev) => {
    if (prev.some(m => m.id === newMsg.id)) return prev;
    return [...prev, newMsg];
  });
});

      } catch (err) {
        console.error("SignalR Error:", err);
      }
    };

    connect();
    return () => chatSocketService.offAll();
  }, []);

  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }

    const syncChat = async () => {
      try {
        const data = await agent.Chats.messages(selectedChatId);
        setMessages(data);

        let retries = 10;
        while (!chatSocketService.isConnected() && retries > 0) {
          await new Promise(r => setTimeout(r, 300));
          retries--;
        }

        await chatSocketService.joinChat(selectedChatId);
      } catch (err) {
        console.error("Помилка синхронізації чату:", err);
      }
    };

    syncChat();
  }, [selectedChatId]);

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId) return;
    try {
      await chatSocketService.sendMessage({
        chatId: selectedChatId,
        ciphertext: content,
        wrappedKey: "none",
        attachments: []
      });
    } catch (err) {
      console.error("Помилка відправки:", err);
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
        currentUserId={currentUser?.id}
        onShowInfo={() => setShowInfo(!showInfo)}
        onSendMessage={handleSendMessage}
        messages={messages}
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
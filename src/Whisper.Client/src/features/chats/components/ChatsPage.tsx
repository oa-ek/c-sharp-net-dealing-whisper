import { useState, useEffect } from "react";
import agent from "../../../api/agent";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { UserInfoSidebar } from "./UserInfoSidebar";

const ChatsPage = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
  const [showInfo, setShowInfo] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const loadInitialData = async () => {
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

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      const loadMessages = async () => {
        try {
          const data = await agent.Chats.messages(selectedChatId);
          setMessages(data);
        } catch (err) {
          console.error("Помилка завантаження історії:", err);
        }
      };
      loadMessages();
    } else {
      setMessages([]); 
    }
  }, [selectedChatId]);

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId) return;
    try {
      const newMsg = { 
        id: Date.now().toString(), 
        ciphertext: content, 
        senderId: currentUser?.id, 
        isMine: true 
      };
      setMessages((prev) => [...prev, newMsg]);
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
        refreshChats={async () => {
           const data = await agent.Chats.list();
           setChats(data);
        }} 
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
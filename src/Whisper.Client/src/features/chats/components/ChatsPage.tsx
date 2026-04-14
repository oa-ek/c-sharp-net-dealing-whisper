import { useState, useEffect, useCallback } from "react";
import agent from "../../../api/agent";
import chatSocketService from "../../../services/ChatSocketService";
import { db, getAuthTokenFromDB } from "../../../api/db";
import { EncryptionService } from "../../../services/encryptionService";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { UserInfoSidebar } from "./UserInfoSidebar";
import type { MessageDto } from "../../../types/chat";

export const ChatsPageFeature = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [decryptedMessages, setDecryptedMessages] = useState<Record<string, string>>({});
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
  const [showInfo, setShowInfo] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState<any>(null);

  const getChatSharedKey = async (chatId: string) => {
    const auth = await db.auth.toCollection().first();
    return auth?.chats?.find((c) => c.chatId === chatId)?.sharedKey;
  };

  const decryptBatch = useCallback(async (msgList: MessageDto[], chatId: string) => {
    const key = await getChatSharedKey(chatId);
    if (!key) return;

    const results: Record<string, string> = {};
    for (const msg of msgList) {
      if (msg.wrappedKey === "handshake_v1") continue;
      try {
        results[msg.id] = await EncryptionService.decryptMessage(msg.ciphertext, msg.wrappedKey, key);
      } catch (e) {
        results[msg.id] = "🔒 Помилка дешифрування";
      }
    }
    setDecryptedMessages(prev => ({ ...prev, ...results }));
  }, []);

  const loadChats = useCallback(async () => {
    try {
      const data = await agent.Chats.list();
      setChats(data);
    } catch (err) {
      console.error("🚨 Помилка чатів:", err);
    }
  }, []);

  const syncHandshakes = useCallback(async (chatsList: any[]) => {
    const auth = await db.auth.toCollection().first();
    if (!auth) return;
    for (const chat of chatsList) {
      const isInitialized = auth.chats?.some(c => c.chatId === chat.id);
      if (!isInitialized) {
        try {
          const history = await agent.Chats.messages(chat.id);
          const handshake = history.find((m: any) => m.ciphertext.startsWith("#InitCode"));
          if (handshake) {
            await EncryptionService.initializeReceiverSide(chat.id, handshake.ciphertext);
            await loadChats();
          }
        } catch (err) {
          console.error(`🚨 Sync error ${chat.id}:`, err);
        }
      }
    }
  }, [loadChats]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (chats.length > 0) syncHandshakes(chats);
  }, [chats, syncHandshakes]);

  useEffect(() => {
    const connect = async () => {
      const token = await getAuthTokenFromDB();
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.nameid);
      } catch (e) { console.error("Token parse error", e); }

      try {
        await chatSocketService.startConnection(token);
        
        chatSocketService.onMessageNew(async (newMsg: MessageDto) => {
          if (newMsg.ciphertext.startsWith("#InitCode")) {
            await EncryptionService.initializeReceiverSide(newMsg.chatId, newMsg.ciphertext);
            await loadChats();
            return;
          }

          const key = await getChatSharedKey(newMsg.chatId);
          if (key && newMsg.wrappedKey !== "handshake_v1") {
            const plain = await EncryptionService.decryptMessage(newMsg.ciphertext, newMsg.wrappedKey, key);
            setDecryptedMessages(prev => ({ ...prev, [newMsg.id]: plain }));
          }

          setMessages((prev) => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          
          setTypingUsers(prev => {
            const next = new Set(prev);
            next.delete(newMsg.senderId);
            return next;
          });

          await loadChats();
        });

        chatSocketService.onMessageRead((updatedMsg: any) => {
          setMessages((prev) => 
            prev.map(m => m.id === updatedMsg.id ? { ...m, isRead: true } : m)
          );
        });

        chatSocketService.onTypingStarted((userId) => {
          if (userId !== currentUserId) setTypingUsers(prev => new Set(prev).add(userId));
        });

        chatSocketService.onTypingStopped((userId) => {
          setTypingUsers(prev => {
            const next = new Set(prev);
            next.delete(userId);
            return next;
          });
        });

      } catch (err) { console.error("🚨 SignalR Error:", err); }
    };
    connect();
    return () => chatSocketService.offAll();
  }, [loadChats, currentUserId]);

  useEffect(() => {
    if (!selectedChatId) return;
    setMessages([]); 
    const loadHistory = async () => {
      try {
        const history = await agent.Chats.messages(selectedChatId);
        const displayMsgs = history.filter((m: any) => !m.ciphertext.startsWith("#InitCode"));
        setMessages(displayMsgs);
        await decryptBatch(displayMsgs, selectedChatId);
        if (chatSocketService.isConnected()) {
          await chatSocketService.joinChat(selectedChatId);
        }
      } catch (err) { console.error("🚨 Помилка історії:", err); }
    };
    loadHistory();
  }, [selectedChatId, decryptBatch]);

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId) return;
    try {
      const sharedKey = await getChatSharedKey(selectedChatId);
      if (!sharedKey) return;
      const { ciphertext, wrappedKey } = await EncryptionService.encryptMessage(content, sharedKey);
      await chatSocketService.sendMessage({
        chatId: selectedChatId,
        ciphertext,
        wrappedKey,
        attachments: []
      });
    } catch (err) {
      console.error("🚨 Помилка відправки:", err);
    }
  };

  const handleOpenProfile = async () => {
    const activeChat = chats.find((c) => c.id === selectedChatId);
    if (!activeChat) return;

    try {
      const results = await agent.Users.search(activeChat.name);
      const user = results.find((u: any) => u.username === activeChat.name) || results[0];
      
      if (user) {
        setProfileData(user);
        setShowInfo(true);
      }
    } catch (err) {
      console.error("Не вдалося завантажити профіль:", err);
    }
  };

  const activeChat = chats.find((c) => c.id === selectedChatId);
  const isPartnerTyping = Array.from(typingUsers).length > 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f9fafb] selection:bg-[#40C3CC]/30">
      <ChatSidebar 
        chats={chats} 
        onSelectChat={(id) => setSelectedChatId(id)} 
        refreshChats={loadChats}
        activeChatId={selectedChatId}
      />
      
       <ChatWindow 
        activeChatId={selectedChatId} 
        activeChatName={activeChat?.name}
        messages={messages.map(m => ({
          ...m,
          ciphertext: decryptedMessages[m.id] || "Розшифрування..."
        }))} 
        currentUserId={currentUserId}
        isPartnerTyping={isPartnerTyping}
        onShowInfo={handleOpenProfile} 
        onSendMessage={handleSendMessage}
      />
      
      {showInfo && (
        <UserInfoSidebar 
          user={profileData} 
          onClose={() => {
            setShowInfo(false);
            setProfileData(null);
          }} 
        />
      )}
    </div>
  );
};
import { useState, useEffect, useCallback, useMemo } from "react";
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
  
  const [activeChatMembers, setActiveChatMembers] = useState<any[]>([]); 
  
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
  const [showInfo, setShowInfo] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);

  const activeChat = useMemo(() => chats.find((c) => c.id === selectedChatId), [chats, selectedChatId]);

  const isPartnerTyping = useMemo(() => {
    if (!selectedChatId || !currentUserId || !activeChatMembers.length) return false;

    const myId = String(currentUserId).toLowerCase();

    const partner = activeChatMembers.find((m: any) => {
      const memberId = m?.id || m; 
      return memberId && String(memberId).toLowerCase() !== myId;
    });

    const partnerId = partner?.id || partner;

    if (!partnerId) return false;

    const normalizedPartnerId = String(partnerId).toLowerCase();
    const isTyping = typingUsers.has(normalizedPartnerId);

    console.log(`[Typing Debug] Partner: ${normalizedPartnerId}, Active: ${isTyping}`);
    
    return isTyping;
  }, [selectedChatId, currentUserId, typingUsers, activeChatMembers]);

  const loadChats = useCallback(async () => {
    try {
      const data = await agent.Chats.list();
      setChats(data);
    } catch (err) {
      console.error("Помилка чатів:", err);
    }
  }, []);

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

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    const connect = async () => {
      const token = await getAuthTokenFromDB();
      if (!token) return;

      let myId: string | null = null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        myId = String(payload.nameid).toLowerCase();
        setCurrentUserId(myId);
      } catch (e) { console.error("Token parse error", e); }

      try {
        await chatSocketService.startConnection(token);
        
        chatSocketService.onMessageNew(async (newMsg: MessageDto) => {
          setTypingUsers(prev => {
            const next = new Set(prev);
            next.delete(String(newMsg.senderId).toLowerCase());
            return next;
          });

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
          await loadChats();
        });

        chatSocketService.onTypingStarted((userId) => {
          if (!userId || !myId) return;
          const nid = String(userId).toLowerCase();
          if (nid === myId) return;
          
          setTypingUsers(prev => new Set(prev).add(nid));
        });

        chatSocketService.onTypingStopped((userId) => {
          if (!userId) return;
          setTypingUsers(prev => {
            const next = new Set(prev);
            next.delete(String(userId).toLowerCase());
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
    setActiveChatMembers([]); 

    const loadData = async () => {
      try {
        const [members, history] = await Promise.all([
          agent.Chats.getMembers(selectedChatId),
          agent.Chats.messages(selectedChatId)
        ]);

        setActiveChatMembers(members);

        const displayMsgs = history.filter((m: any) => !m.ciphertext.startsWith("#InitCode"));
        setMessages(displayMsgs);
        await decryptBatch(displayMsgs, selectedChatId);
        
        if (chatSocketService.isConnected()) {
          await chatSocketService.joinChat(selectedChatId);
        }
      } catch (err) { console.error("Помилка:", err); }
    };
    loadData();
  }, [selectedChatId, decryptBatch]);

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId) return;
    try {
      const sharedKey = await getChatSharedKey(selectedChatId);
      if (!sharedKey) return;
      const { ciphertext, wrappedKey } = await EncryptionService.encryptMessage(content, sharedKey);
      await chatSocketService.sendMessage({
        chatId: selectedChatId, ciphertext, wrappedKey, attachments: []
      });
    } catch (err) { console.error("Помилка відправки:", err); }
  };

  const handleOpenProfile = async () => {
    if (!activeChat) return;
    try {
      const results = await agent.Users.search(activeChat.name);
      const user = results.find((u: any) => u.username === activeChat.name) || results[0];
      if (user) {
        setProfileData(user);
        setShowInfo(true);
      }
    } catch (err) { console.error("Не вдалося завантажити профіль:", err); }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f9fafb]">
      <ChatSidebar 
        chats={chats} onSelectChat={(id) => setSelectedChatId(id)} 
        refreshChats={loadChats} activeChatId={selectedChatId}
      />
       <ChatWindow 
        activeChatId={selectedChatId} activeChatName={activeChat?.name}
        messages={messages.map(m => ({ ...m, ciphertext: decryptedMessages[m.id] || "..." }))} 
        currentUserId={currentUserId} isPartnerTyping={isPartnerTyping}
        onShowInfo={handleOpenProfile} onSendMessage={handleSendMessage}
      />
      {showInfo && <UserInfoSidebar user={profileData} onClose={() => { setShowInfo(false); setProfileData(null); }} />}
    </div>
  );
};
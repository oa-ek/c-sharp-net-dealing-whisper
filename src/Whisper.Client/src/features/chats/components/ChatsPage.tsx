import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import agent from "../../../api/agent";
import chatSocketService from "../../../services/ChatSocketService";
import { db, getAuthTokenFromDB } from "../../../api/db";
import { EncryptionService } from "../../../services/encryptionService";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { UserInfoSidebar } from "./UserInfoSidebar";
import type { ChatDto, MessageDto } from "../../../types/chat";
import type { UserDto } from "../../../types/user";

export const ChatsPageFeature = () => {
  const [chats, setChats] = useState<ChatDto[]>([]);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [decryptedMessages, setDecryptedMessages] = useState<Record<string, string>>({});
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [activeChatMembers, setActiveChatMembers] = useState<any[]>([]); 
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(undefined);
  const [selectedChat, setSelectedChat] = useState<ChatDto>();
  const [showInfo, setShowInfo] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserDto>();
  const [activeUser, setActiveUser] = useState<UserDto>();
  const [chatMembers, setChatMembers] = useState<Record<string, UserDto[]>>();

  const chatsRef = useRef(chats);
  useEffect(() => { chatsRef.current = chats; }, [chats]);

  useEffect(() => {
    const getActiveUser = async() => { setActiveUser(await agent.Users.getMe()); }
    getActiveUser();
  }, [])

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
    return typingUsers.has(String(partnerId).toLowerCase());
  }, [selectedChatId, currentUserId, typingUsers, activeChatMembers]);

  const loadChats = useCallback(async () => {
    try {
      const data = await agent.Chats.list();
      setChats(data);
    } catch (err) {
      console.error("Помилка завантаження списку чатів:", err);
    }
  }, []);

  const getChatSharedKey = async (chatId: string) => {
    const auth = await db.auth.toCollection().last(); 
    return auth?.chats?.find((c) => c.chatId === chatId)?.sharedKey;
  };

  const decryptBatch = useCallback(async (msgList: MessageDto[], chatId: string) => {
    const key = await getChatSharedKey(chatId);
    if (!key) {
      console.warn(`[Crypto] Немає ключа для чату ${chatId}. Дешифрування неможливе.`);
      return;
    }
    const results: Record<string, string> = {};
    for (const msg of msgList) {
      if (msg.wrappedKey === "handshake_v1" || msg.ciphertext.startsWith("#InitCode")) continue;
      try {
        results[msg.id] = await EncryptionService.decryptMessage(msg.ciphertext, msg.wrappedKey, key);
      } catch (e) {
        results[msg.id] = "Помилка дешифрування";
      }
    }
    setDecryptedMessages(prev => ({ ...prev, ...results }));
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (chats.length === 0) return;
    const getChatMembers = async(chatId: string) => {
      const members = await agent.Chats.getMembers(chatId);
      setChatMembers((prev) => ({
        ...prev,
        [chatId]: members
      }))
    } 

    chats.forEach((chat) => {
      getChatMembers(chat.id);
    });
  }, [chats])

  useEffect(() => {
    const connect = async () => {
      const token = await getAuthTokenFromDB();
      if (!token) {
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(String(payload.nameid).toLowerCase());
      } catch (e) { console.error("Помилка парсингу токена", e); }

      try {
        await chatSocketService.startConnection(token);
        
        chatSocketService.onMessageNew(async (newMsg: MessageDto) => {
          setTypingUsers(prev => {
            const next = new Set(prev);
            next.delete(String(newMsg.senderId).toLowerCase());
            return next;
          });

          if (newMsg.ciphertext.startsWith("#InitCode")) {
            const success = await EncryptionService.initializeReceiverSide(newMsg.chatId, newMsg.ciphertext);
            if (success) {
              await loadChats();
            }
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
        });

        chatSocketService.onTypingStarted((userId) => {
          const nid = String(userId).toLowerCase();
          if (nid !== currentUserId) setTypingUsers(prev => new Set(prev).add(nid));
        });

        chatSocketService.onTypingStopped((userId) => {
          setTypingUsers(prev => {
            const next = new Set(prev);
            next.delete(String(userId).toLowerCase());
            return next;
          });
        });

      } catch (err) { console.error("SignalR Error:", err); }
    };

    connect();
    return () => { chatSocketService.offAll(); };
  }, [loadChats, currentUserId]);

  useEffect(() => {
    if (!selectedChatId) return;
    
    const loadData = async () => {
      try {
        console.log(`[Chat] Завантаження історії для ${selectedChatId}`);
        const [members, history] = await Promise.all([
          agent.Chats.getMembers(selectedChatId),
          agent.Chats.messages(selectedChatId)
        ]);

        setActiveChatMembers(members);

        const initMsg = history.find((m: any) => m.ciphertext.startsWith("#InitCode"));
        if (initMsg) {
          const existingKey = await getChatSharedKey(selectedChatId);
          if (!existingKey) {
            console.log("[Crypto] Знайдено InitCode в історії, ключ відсутній. Ініціалізація...");
            const res = await EncryptionService.initializeReceiverSide(selectedChatId, initMsg.ciphertext);
            if (res) await loadChats();
          }
        }

        const displayMsgs = history.filter((m: any) => !m.ciphertext.startsWith("#InitCode"));
        setMessages(displayMsgs);
        
        await decryptBatch(displayMsgs, selectedChatId);
        
        if (chatSocketService.isConnected()) {
          await chatSocketService.joinChat(selectedChatId);
        }
      } catch (err) { console.error("Помилка завантаження даних чату:", err); }
    };

    loadData();
  }, [selectedChatId, decryptBatch, loadChats]);

  const handleSendMessage = async (content: string, attachments: any[] = []) => {
  if (!selectedChatId) return;
  try {
    const sharedKey = await getChatSharedKey(selectedChatId);
    if (!sharedKey) {
        alert("Канал ще не захищено. Зачекайте ініціалізації.");
        return;
    }
    const { ciphertext, wrappedKey } = await EncryptionService.encryptMessage(content, sharedKey);
    
    await chatSocketService.sendMessage({
      chatId: selectedChatId, 
      ciphertext, 
      wrappedKey, 
      attachments: attachments 
    });
    } catch (err) { console.error("Помилка відправки:", err); }
  };
  

  // handles opening of profile info and sets the user for it
  const handleOpenProfile = async () => {
    if (!activeChat || !chatMembers || !selectedChat) return;
    try {
      const user = chatMembers[selectedChat.id].find((member) => member.id != activeUser?.id)
      if (user) {
        setProfileData(user);
        setShowInfo(true);
      }
    } catch (err) { console.error("Не вдалося завантажити профіль:", err); }
  };

  const handleChatRemoval = async () => {
    if (!selectedChat) return;
    agent.Chats.remove(selectedChat.id);
    const localDb = await db.auth.toCollection().last();
    if (localDb) {
      // console.log(localDb.chats.filter((chat) => chat.chatId != activeChat.id))
      await db.auth.put({...localDb, chats: localDb.chats.filter((chat) => chat.chatId != selectedChat.id)})
    } 
    loadChats();
    setSelectedChatId(undefined)
  }

  // set active chat when selectedChatId is updated
  useEffect(() => {
    setSelectedChat(chats.find((chat) => chat.id === selectedChatId))
  }, [selectedChatId])

  // handle chat info panel update when switching chats
  useEffect(() => {
    if (showInfo && selectedChat && chatMembers) {
      console.log("Update happened just now!")
      const user = chatMembers[selectedChat.id].find((member) => member.id != activeUser?.id)
      if (user) {
        setProfileData(user);
      }
    }
  }, [selectedChat])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f9fafb]">
      <ChatSidebar 
        chats={chats}
        activeUser={activeUser}
        onSelectChat={(id) => setSelectedChatId(id)} 
        refreshChats={loadChats} 
        activeChatId={selectedChatId}
        chatMembers={chatMembers}
      />
      {
        selectedChat ? 
        <ChatWindow 
        activeChat={selectedChat} 
        messages={messages.map(m => ({ 
            ...m, 
            ciphertext: decryptedMessages[m.id] || (m.ciphertext.startsWith("#Init") ? "[System Handshake]" : "...") 
        }))} 
        currentUserId={currentUserId} 
        isPartnerTyping={isPartnerTyping}
        onShowInfo={handleOpenProfile} 
        onSendMessage={handleSendMessage}
        onChatRemoval={handleChatRemoval}
        activeChatMembers={chatMembers ? chatMembers[selectedChat.id] : undefined}
      /> 
      :
      <p>
        {/* Select chat to begin chatting */}
      </p>
      }
      {showInfo && profileData && (
        <UserInfoSidebar 
          user={profileData} 
          onClose={() => { setShowInfo(false); }} 
        />
      )}
    </div>
  );
};
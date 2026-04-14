import React, { useState } from "react";
import agent from "../../../api/agent";
import { wipeLocalData, clearAuthData } from "../../../api/db";
import ChatSocketService from "../../../services/ChatSocketService";
import { ChangePasswordModal } from "../../auth/ChangePasswordModal";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { EncryptionService } from "../../../services/encryptionService";
import { 
  Search, Settings, LogOut, User, UserPlus, 
  Loader2, MessageSquarePlus, ShieldAlert 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import logo from "@/components/ui/WhisperLogo.ico";

interface SidebarProps {
  chats: any[];
  onSelectChat: (id: string) => void;
  refreshChats: () => Promise<void>;
}

export const ChatSidebar = ({ chats, onSelectChat, refreshChats }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [shouldWipe, setShouldWipe] = useState(false);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      setIsSearching(true);
      try {
        const users = await agent.Users.search(searchQuery);
        setSearchResults(users);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

const handleLogoutFinal = async () => {
  try {
    await agent.Auth.logout().catch(() => {});

    if (shouldWipe) {
      await wipeLocalData();
    } else {
      await clearAuthData();
    }

    await ChatSocketService.stopConnection();

    localStorage.clear();

    window.location.replace("/auth/login"); 

  } catch (err) {
    window.location.replace("/auth/login");
  }
};

const handleCreateChat = async (targetUser: any) => {
  setIsCreating(true);
  try {
    const serverChat = await agent.Chats.create(targetUser.id, targetUser.username);
    const serverChatId = serverChat.id.toString();
    const deviceIds = targetUser.activeDeviceIds || [];

    for (const deviceId of deviceIds) {
      const { systemContent } = await EncryptionService.initializeChat(serverChatId, targetUser.id, deviceId);
      
      await ChatSocketService.sendMessage({
        chatId: serverChatId,
        ciphertext: systemContent,
        wrappedKey: "handshake_v1",
        attachments: []
      });
    }

    await refreshChats();
  } catch (err) {
    console.error("Create Chat Error:", err);
  } finally {
    setIsCreating(false);
  }
};
  return (
    <div className="w-80 h-full border-r border-zinc-800 flex flex-col bg-[#141414] relative">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-[#141414]">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Whisper" className="w-8 h-8" />
          <span className="text-white font-bold tracking-tight text-lg">Whisper</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-800 focus-visible:ring-0">
              <Avatar className="w-8 h-8 border border-zinc-700">
                <AvatarFallback className="bg-zinc-900 text-[10px] text-zinc-400">ME</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1a1a1a] border-zinc-800 text-zinc-300 shadow-2xl">
            <DropdownMenuLabel className="text-zinc-500 font-normal">Мій акаунт</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="hover:!bg-zinc-800 cursor-pointer py-2 focus:bg-zinc-800">
              <User className="mr-2 h-4 w-4 text-emerald-500" /> Профіль
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="hover:!bg-zinc-800 cursor-pointer py-2 focus:bg-zinc-800">
              <Settings className="mr-2 h-4 w-4 text-zinc-400" /> Налаштування
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem onClick={() => setIsLogoutOpen(true)} className="hover:!bg-zinc-800 !text-red-400 cursor-pointer py-2 focus:bg-zinc-800">
              <LogOut className="mr-2 h-4 w-4" /> Вийти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-4 bg-[#141414] relative z-50">
        <div className="relative group">
          {isSearching ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-spin" /> : <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors" />}
          <Input 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value === "") setSearchResults([]);
            }}
            onKeyDown={handleSearch}
            placeholder="Знайти юзера (Enter)..." 
            className="pl-9 bg-zinc-900/50 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 h-9 transition-all"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="absolute left-4 right-4 mt-2 bg-[#1a1a1a] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <ScrollArea className="max-h-[280px]">
              <div className="p-1">
                {searchResults.map((user) => (
                  <div 
                    key={user.id} 
                    onClick={() => !isCreating && handleCreateChat(user)}
                    className="p-3 flex items-center justify-between rounded-lg hover:bg-emerald-500/10 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 border border-zinc-800">
                        <AvatarFallback className="bg-zinc-800 text-xs text-zinc-400">{user.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-zinc-200 font-medium group-hover:text-emerald-400 transition-colors">{user.username}</span>
                    </div>
                    <UserPlus className="w-4 h-4 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      <div className="px-4 mb-2 flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest px-2">Повідомлення</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-emerald-500 hover:bg-transparent">
            <MessageSquarePlus className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 pb-2 space-y-1">
          {chats.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => onSelectChat(chat.id)}
              className="p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-zinc-900/80 transition-all border border-transparent hover:border-zinc-800 group"
            >
              <Avatar className="border border-zinc-800 w-11 h-11">
                <AvatarFallback className="bg-zinc-800 text-zinc-400 uppercase">
                  {chat.name ? chat.name[0] : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-300 group-hover:text-white truncate transition-colors">{chat.name}</p>
                <p className="text-xs text-zinc-500 truncate">Відкрити листування</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-zinc-900 bg-[#121212] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase">Whisper Secure E2EE</span>
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {isLogoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-red-500">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Завершити сесію?</h3>
            </div>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed italic">Ви впевнені, що хочете вийти з облікового запису?</p>

            <div 
              onClick={() => setShouldWipe(!shouldWipe)}
              className="flex items-center gap-3 p-3 mb-6 rounded-xl bg-zinc-900/50 border border-zinc-800 cursor-pointer hover:bg-zinc-800/50 transition-all group"
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${shouldWipe ? 'bg-red-500 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-zinc-700'}`}>
                {shouldWipe && <div className="w-2 h-2 bg-white rounded-full animate-in zoom-in-50" />}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-zinc-200">Очистити локальний кеш</span>
                <span className="text-[10px] text-zinc-500 italic">Стерти всі повідомлення та девайс ID</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                className="flex-1 bg-zinc-900 text-zinc-300 border border-zinc-800"
                onClick={() => setIsLogoutOpen(false)}
              >
                Скасувати
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleLogoutFinal}
              >
                Вийти
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
import React, { useEffect, useEffectEvent, useState } from "react";
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
  Loader2, MessageSquarePlus, ShieldAlert, 
  InfoIcon,
  EllipsisVertical
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
import { UserProfile } from "../../users/components/UserProfileModal";
import type { UserDto } from "../../../types/user";
import type { ChatDto } from "../../../types/chat";
import {RemoteAvatar} from "./RemoteAvatar";

interface SidebarProps {
  chats: ChatDto[];
  activeUser: UserDto | undefined;
  onSelectChat: (id: string) => void;
  refreshChats: () => Promise<void>;
  activeChatId?: string; 
  chatMembers?: Record<string, UserDto[]>;
}

export const ChatSidebar = ({ chats, activeUser, onSelectChat, refreshChats, activeChatId, chatMembers }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
      setSearchResults([]);
      setSearchQuery("");
    } catch (err) {
      console.error("Create Chat Error:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-80 h-full border-r border-gray-200 flex flex-col bg-white relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Whisper" className="w-8 h-8" />
          <span className="text-[#111] font-black tracking-tighter text-xl bg-gradient-to-r from-[#64B59D] via-[#348F96] to-[#2D6BA3] bg-clip-text text-transparent">
            Whisper
          </span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 focus-visible:ring-0 transition-colors">
              <RemoteAvatar 
                link={activeUser?.pfpLink || undefined} 
                initial="ME"
                className="w-8 h-8 border border-gray-200 shadow-sm"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200 text-gray-700 shadow-2xl rounded-2xl p-1 animate-in zoom-in-95">
            <DropdownMenuLabel className="text-gray-400 font-bold text-[10px] uppercase tracking-widest px-3 py-2">Мій акаунт</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem onClick={() => setIsProfileOpen(true)} className="hover:bg-gray-50 cursor-pointer py-2.5 px-3 rounded-xl focus:bg-gray-50 transition-colors">
              <User className="mr-2 h-4 w-4 text-[#348F96]" /> Профіль
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="hover:bg-gray-50 cursor-pointer py-2.5 px-3 rounded-xl focus:bg-gray-50 transition-colors">
              <Settings className="mr-2 h-4 w-4 text-gray-400" /> Налаштування
            </DropdownMenuItem> */}
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem onClick={() => setIsLogoutOpen(true)} className="hover:bg-red-50 !text-red-600 cursor-pointer py-2.5 px-3 rounded-xl focus:bg-red-50 transition-colors">
              <LogOut className="mr-2 h-4 w-4" /> Вийти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search Section */}
      <div className="p-4 relative z-40">
        <div className="relative group">
          {isSearching ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#348F96] animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-[#348F96]" />
          )}
          <Input 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value === "") setSearchResults([]);
            }}
            onKeyDown={handleSearch}
            placeholder="Знайти юзера..." 
            className="pl-9 bg-gray-50 border-gray-200 text-[#111] placeholder:text-gray-400 h-10 rounded-xl focus-visible:ring-2 focus-visible:ring-[#348F96]/20 transition-all border-none shadow-inner"
          />
        </div>

        {searchResults.length > 0 && (
          <div className="absolute left-4 right-4 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
            <ScrollArea className="max-h-[280px]">
              <div className="p-1">
                {searchResults.map((user) => (
                  <div 
                    key={user.id} 
                    onClick={() => !isCreating && handleCreateChat(user)}
                    className="p-3 flex items-center justify-between rounded-xl hover:bg-gray-50 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 border border-gray-100">
                        <AvatarFallback className="bg-gray-100 text-xs text-gray-500 font-bold">{user.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {/* <RemoteAvatar 
                        link={user.pfpLink || undefined} 
                        initial={user.username[0].toUpperCase()} 
                        className="w-9 h-9 border border-gray-100"
                      /> */}
                      <span className="text-sm text-gray-700 font-bold group-hover:text-[#2D6BA3] transition-colors">{user.username}</span>
                    </div>
                    <UserPlus className="w-4 h-4 text-gray-400 group-hover:text-[#348F96] transition-all" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      <div className="px-4 mb-2 flex items-center justify-between">
        <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest px-2">Повідомлення</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-[#348F96] hover:bg-transparent transition-colors">
            <MessageSquarePlus className="w-4 h-4" />
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1.5 pb-4">
          {chats.map((chat) => {
            const isActive = activeChatId === chat.id;
            const chatMember = chatMembers ? chatMembers[chat.id]?.find((member) => member.id != activeUser?.id) : null;
            const chatDisplayName: string = 
              chat.isGroup ?
                chat.name :
                chatMember ?
                  chatMember?.displayName ?
                    chatMember?.displayName :
                    chatMember?.username :
                  "?";
            return (
              <div 
                key={chat.id} 
                onClick={() => onSelectChat(chat.id)}
                className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all border relative overflow-hidden group ${
                  isActive 
                    ? "bg-linear-[135deg] from-[#64B59D] via-[#348F96] to-[#2D6BA3] border-transparent shadow-lg shadow-blue-900/10 scale-[1.01]" 
                    : "hover:bg-gray-50 border-transparent hover:border-gray-100"
                }`}
              >
                <RemoteAvatar 
                  link={chatMember?.pfpLink || undefined} 
                  initial={chatDisplayName[0]} 
                  className={`w-11 h-11 border transition-colors ${isActive ? "border-white/30" : "border-gray-200"}`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate transition-colors ${isActive ? "text-white" : "text-gray-900"}`}>
                    { chatDisplayName }
                  </p>
                  <p className={`text-[11px] font-medium truncate transition-colors ${isActive ? "text-white/80" : "text-gray-400"}`}>
                    {/* E2EE Secure Session */}
                  </p>
                </div>
                {isActive && (
                   <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer Branding */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#64B59D] animate-pulse shadow-[0_0_8px_#64B59D]" />
          <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.25em]">SAFE INTERNET IS HERE</span>
        </div>
      </div>

      {/* <ChangePasswordModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      /> */}

      <UserProfile
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      {/* Logout Modal */}
      {isLogoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="w-full max-w-sm bg-white border border-gray-100 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-[#2D6BA3]">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="text-xl font-black text-[#111] uppercase tracking-tighter">Завершити сесію?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed italic">Ви впевнені, що хочете вийти з облікового запису?</p>

            <div 
              onClick={() => setShouldWipe(!shouldWipe)}
              className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all group"
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                shouldWipe ? 'bg-[#2D6BA3] border-[#2D6BA3] shadow-sm' : 'border-gray-300 bg-white'
              }`}>
                {shouldWipe && <div className="w-2 h-2 bg-white rounded-full animate-in zoom-in-50" />}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-700">Очистити локальний кеш</span>
                <span className="text-[10px] text-gray-400">Стерти ключі та історію</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                className="flex-1 bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200 rounded-xl transition-all"
                onClick={() => setIsLogoutOpen(false)}
              >
                Скасувати
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-[#64B59D] via-[#348F96] to-[#2D6BA3] text-white font-bold border-none shadow-lg hover:opacity-90 rounded-xl transition-all active:scale-95"
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
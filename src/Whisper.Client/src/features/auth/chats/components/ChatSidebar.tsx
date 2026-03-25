import { useState } from "react";
import agent from "../../../../api/agent";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { 
  Search, 
  Settings, 
  LogOut, 
  User, 
  UserPlus, 
  Loader2,
  MessageSquarePlus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
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

  // Пошук користувачів у БД через UsersController
  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      setIsSearching(true);
      try {
        const users = await agent.Users.search(searchQuery);
        setSearchResults(users);
      } catch (err) {
        console.error("Помилка при пошуку користувачів:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  // Створення нового чату при виборі користувача зі списку
  const handleCreateChat = async (targetUser: any) => {
    setIsCreating(true);
    try {
      // Виклик [HttpPost("create/{receiverId}")]
      await agent.Chats.create(targetUser.id, targetUser.username);
      
      setSearchQuery("");
      setSearchResults([]);
      
      await refreshChats();
      
      console.log(`Чат з ${targetUser.username} успішно створено`);
    } catch (err: any) {
      console.error("Помилка створення чату:", err);
      if (err.response?.status === 404) {
        alert("Помилка 404: Перевір маршрут на бекенді (api/chats/create/{id})");
      } else {
        alert("Не вдалося створити чат. Можливо, він уже існує.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-80 h-full border-r border-zinc-800 flex flex-col bg-[#141414] relative">
      {/* Header */}
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
            <DropdownMenuItem className="hover:!bg-zinc-800 cursor-pointer py-2 focus:bg-zinc-800">
              <Settings className="mr-2 h-4 w-4 text-zinc-400" /> Налаштування
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="hover:!bg-zinc-800 !text-red-400 cursor-pointer py-2 focus:bg-zinc-800">
              <LogOut className="mr-2 h-4 w-4" /> Вийти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Пошук та результати */}
      <div className="p-4 bg-[#141414] relative z-50">
        <div className="relative group">
          {isSearching ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
          )}
          <Input 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value === "") setSearchResults([]);
            }}
            onKeyDown={handleSearch}
            placeholder="Знайти юзера (Enter)..." 
            className="pl-9 bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500/30 text-zinc-200 placeholder:text-zinc-600 h-9 transition-all"
          />
        </div>

        {/* Випадаючий список результатів пошуку */}
        {searchResults.length > 0 && (
          <div className="absolute left-4 right-4 mt-2 bg-[#1a1a1a] border border-zinc-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 border-b border-zinc-800 bg-zinc-900/50">
              <span className="text-[10px] uppercase font-bold text-zinc-500 px-2 tracking-widest">Результати пошуку</span>
            </div>
            <ScrollArea className="max-h-[280px]">
              <div className="p-1">
                {searchResults.map((user) => (
                  <div 
                    key={user.id} 
                    onClick={() => !isCreating && handleCreateChat(user)}
                    className={`p-3 flex items-center justify-between rounded-lg hover:bg-emerald-500/10 cursor-pointer transition-all group ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 border border-zinc-800">
                        <AvatarFallback className="bg-zinc-800 text-xs text-zinc-400">{user.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm text-zinc-200 font-medium group-hover:text-emerald-400 transition-colors">{user.username}</span>
                        <span className="text-[10px] text-zinc-500">Натисніть, щоб почати чат</span>
                      </div>
                    </div>
                    <UserPlus className="w-4 h-4 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Список активних чатів */}
      <div className="px-4 mb-2 flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest px-2">Повідомлення</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-emerald-500 hover:bg-transparent">
            <MessageSquarePlus className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 pb-2 space-y-1">
          {chats.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xs text-zinc-600 italic">Список порожній. Знайдіть когось через пошук вище.</p>
            </div>
          ) : (
            chats.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => onSelectChat(chat.id)}
                className="p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-zinc-900/80 transition-all border border-transparent hover:border-zinc-800 group"
              >
                <div className="relative">
                  <Avatar className="border border-zinc-800 w-11 h-11 transition-transform group-hover:scale-105">
                    <AvatarFallback className="bg-zinc-800 text-zinc-400 uppercase group-hover:text-zinc-200">
                      {chat.name ? chat.name[0] : "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-medium text-zinc-300 group-hover:text-white truncate transition-colors">
                      {chat.name}
                    </p>
                    <span className="text-[10px] text-zinc-600">12:45</span>
                  </div>
                  <p className="text-xs text-zinc-500 group-hover:text-zinc-400 truncate transition-colors">
                    Відкрити листування
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer / Status */}
      <div className="p-3 border-t border-zinc-900 bg-[#121212] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase">Whisper Secure E2EE</span>
        </div>
      </div>
    </div>
  );
};
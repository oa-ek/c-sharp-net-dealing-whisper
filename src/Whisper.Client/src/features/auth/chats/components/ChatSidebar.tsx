import { useState } from "react";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Search, Settings, LogOut, User, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import logo from "@/components/ui/WhisperLogo.ico";

const mockChats = [
  { id: "1", name: "Illia Davidyuk", lastMessage: "JWT fix is live.", time: "10:15", unread: 2 },
  { id: "2", name: "Team Whisper", lastMessage: "Check the new logo!", time: "09:50", unread: 0 },
];

export const ChatSidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      console.log(`Шукаємо користувача: ${searchQuery}`);
      // ТУТ БУДЕ Твій запит: userService.search(searchQuery)
      alert(`Пошук користувача: ${searchQuery}`); 
    }
  };

  return (
    <div className="w-80 h-full border-r border-zinc-800 flex flex-col bg-[#141414]">
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
            <DropdownMenuItem className="hover:!bg-zinc-800 hover:!text-white cursor-pointer py-2 focus:bg-zinc-800 focus:text-white transition-colors">
              <User className="mr-2 h-4 w-4 text-emerald-500" /> Профіль
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:!bg-zinc-800 hover:!text-white cursor-pointer py-2 focus:bg-zinc-800 focus:text-white transition-colors">
              <Settings className="mr-2 h-4 w-4 text-zinc-400" /> Налаштування
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="hover:!bg-zinc-800 !text-red-400 cursor-pointer py-2 focus:bg-zinc-800 transition-colors">
              <LogOut className="mr-2 h-4 w-4" /> Вийти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Пошук юзерів */}
      <div className="p-4 bg-[#141414]">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Пошук (Enter)..." 
            className="pl-9 bg-zinc-900/50 border-zinc-800 focus-visible:ring-emerald-500/30 text-zinc-200 placeholder:text-zinc-600 h-9 transition-all"
          />
        </div>
      </div>

      {/* Список чатів */}
      <ScrollArea className="flex-1">
        <div className="px-2 pb-2 space-y-1">
          {mockChats.map((chat) => (
            <div 
              key={chat.id} 
              className="p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-zinc-900/80 transition-all border border-transparent hover:border-zinc-800 group"
            >
              <Avatar className="border border-zinc-800 w-11 h-11">
                <AvatarFallback className="bg-zinc-800 text-zinc-400 group-hover:text-zinc-200">{chat.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-medium text-zinc-300 group-hover:text-white truncate transition-colors">{chat.name}</p>
                  <span className="text-[10px] text-zinc-500">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-xs text-zinc-500 group-hover:text-zinc-400 truncate pr-2 transition-colors">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-emerald-500 text-black text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
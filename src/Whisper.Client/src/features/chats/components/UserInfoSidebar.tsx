import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { X, Clock, Info } from "lucide-react";
import type { UserDto } from "../../../types/user";
import { RemoteAvatar } from "./RemoteAvatar";

interface UserInfoProps {
  user: UserDto;
  onClose: () => void;
}

export const UserInfoSidebar = ({ user, onClose }: UserInfoProps) => {
  if (!user) return null;

  const getInitial = () => {
    const name = user.displayName || user.username || "?";
    return name[0].toUpperCase();
  };

  const formatLastSeen = (date?: string | Date) => {
    if (!date) return "невідомо";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "нещодавно";
      
      return d.toLocaleString('uk-UA', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "нещодавно";
    }
  };

  

  return (
    <div className="w-80 h-full border-l border-gray-200 bg-white flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl z-50">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
        <span className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] px-2">
          Інформація
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="hover:bg-gray-100 text-gray-400 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {/* Main Profile Info */}
        <div className="p-8 flex flex-col items-center text-center border-b border-gray-50">
          <div className="relative mb-6">
            <RemoteAvatar 
              link={user.pfpLink || undefined} 
              initial={getInitial()} 
              className="w-32 h-32 border-4 border-white shadow-xl shadow-blue-100/50" 
            />
            {/* Статус-крапка */}
            {/* <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-sm" /> */}
          </div>

          <h2 className="text-2xl font-black text-[#111] tracking-tight leading-tight">
            {user.displayName || user.username || "Користувач"}
          </h2>
          {/* Акцентний колір для юзернейму */}
          <p className="text-sm font-bold text-[#3E93E6] mt-1 tracking-wide">
            @{user.username}
          </p>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-8">

          {/* Activity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4 text-[#40C3CC]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Активність</span>
            </div>
            <p className="text-sm text-gray-600 font-medium pl-6">
               Був у мережі: <span className="text-[#3E93E6] font-bold">{formatLastSeen(user.lastSeen)}</span>
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-400">
                <Info className="w-4 h-4 text-[#40C3CC]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Про себе</span>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 shadow-sm shadow-gray-100/50">
                <p className="text-sm text-[#222] leading-relaxed italic">
                  {user.bio || "Опис профілю порожній."}
                </p>
            </div>
          </div>

        </div>
      </ScrollArea>

      {/* Footer із затіненням */}
      <div className="p-6 text-center border-t border-gray-100 bg-gray-50/30">
         <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.3em]">
           Whisper Protocol v2
         </p>
      </div>
    </div>
  );
};
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { X, Clock, Info } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  displayName?: string | null;
  pfpLink?: string | null;
  bio?: string | null;
  lastSeen?: string | Date;
}

interface UserInfoProps {
  user: UserProfile | null;
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
    <div className="w-80 h-full border-l border-zinc-800 bg-[#141414] flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl z-50">
      
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em] px-2">
          Інформація
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="hover:bg-zinc-800 text-zinc-500 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-8 flex flex-col items-center text-center border-b border-zinc-900/50">
          <div className="relative mb-6">
            <Avatar className="w-32 h-32 border-4 border-zinc-800 shadow-2xl">
              <AvatarImage src={user.pfpLink || ""} className="object-cover" />
              <AvatarFallback className="text-4xl bg-zinc-900 text-zinc-400 uppercase font-black">
                {getInitial()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-[#141414] rounded-full" />
          </div>

          <h2 className="text-xl font-black text-white tracking-tight leading-tight">
            {user.displayName || user.username || "Користувач"}
          </h2>
          <p className="text-sm text-emerald-500 font-bold mt-1 tracking-wide">
            @{user.username}
          </p>
        </div>

        <div className="p-6 space-y-6">

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Активність</span>
            </div>
            <p className="text-sm text-zinc-300 font-medium pl-5.5">
               Був у мережі: <span className="text-zinc-400">{formatLastSeen(user.lastSeen)}</span>
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-500">
                <Info className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Про себе</span>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
                <p className="text-sm text-zinc-300 leading-relaxed italic">
                  {user.bio || "Опис профілю порожній."}
                </p>
            </div>
          </div>

        </div>
      </ScrollArea>

      <div className="p-6 text-center border-t border-zinc-900/50">
         <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.3em]">
           Whisper Protocol v2
         </p>
      </div>
    </div>
  );
};
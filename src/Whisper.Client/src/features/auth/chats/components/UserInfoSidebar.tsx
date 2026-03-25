import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { X, Shield, Bell, Image as ImageIcon, FileText } from "lucide-react";

interface UserInfoProps {
  user: { name: string; username: string };
  onClose: () => void;
}

export const UserInfoSidebar = ({ user, onClose }: UserInfoProps) => {
  return (
    <div className="w-80 h-full border-l border-zinc-800 bg-[#141414] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-[#141414]">
        <span className="text-zinc-400 font-medium text-sm">Інформація</span>
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-zinc-800 text-zinc-500">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-8 flex flex-col items-center text-center">
          <Avatar className="w-28 h-28 mb-4 border-4 border-zinc-800 shadow-2xl">
            <AvatarFallback className="text-3xl bg-zinc-900 text-zinc-400 uppercase">{user.name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold text-white tracking-tight">{user.name}</h2>
          <p className="text-sm text-emerald-500 font-medium mt-1">{user.username}</p>
        </div>

        <div className="px-6 space-y-1">
          <p className="text-[10px] uppercase font-bold text-zinc-600 px-3 mb-2 tracking-widest text-center">Дії</p>
          <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:bg-zinc-900/50 h-11 rounded-xl focus:bg-zinc-900">
            <Shield className="mr-3 w-4 h-4 text-emerald-500" /> Шифрування E2EE
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:bg-zinc-900/50 h-11 rounded-xl focus:bg-zinc-900">
            <Bell className="mr-3 w-4 h-4 text-zinc-500" /> Сповіщення
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:bg-zinc-900/50 h-11 rounded-xl focus:bg-zinc-900">
            <ImageIcon className="mr-3 w-4 h-4 text-zinc-500" /> Медіа файли
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};
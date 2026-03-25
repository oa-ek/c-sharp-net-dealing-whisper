import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { X, Shield, Bell, Image as ImageIcon, FileText, User } from "lucide-react";

export const UserInfoSidebar = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="w-80 h-full border-l border-zinc-800 bg-[#141414] flex flex-col animate-in slide-in-from-right duration-300 ease-out">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-[#141414]">
        <span className="text-zinc-400 font-medium text-sm">Інформація про юзера</span>
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-zinc-800 text-zinc-500">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-8 flex flex-col items-center text-center">
          <Avatar className="w-28 h-28 mb-4 border-4 border-zinc-800 shadow-2xl">
            <AvatarFallback className="text-3xl bg-zinc-900 text-zinc-500">ID</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold text-white tracking-tight">Illia Davidyuk</h2>
          <p className="text-sm text-emerald-500 font-medium mt-1">@chicago_dev</p>
        </div>

        <div className="px-6 space-y-1">
          <p className="text-[10px] uppercase font-bold text-zinc-600 px-3 mb-2 tracking-widest">Дії</p>
          <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:bg-zinc-900/50 h-11 rounded-xl">
            <Shield className="mr-3 w-4 h-4 text-emerald-500" /> Шифрування E2EE
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:bg-zinc-900/50 h-11 rounded-xl">
            <Bell className="mr-3 w-4 h-4 text-zinc-500" /> Сповіщення
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:bg-zinc-900/50 h-11 rounded-xl">
            <ImageIcon className="mr-3 w-4 h-4 text-zinc-500" /> Медіа файли
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:bg-zinc-900/50 h-11 rounded-xl">
            <FileText className="mr-3 w-4 h-4 text-zinc-500" /> Документи
          </Button>
        </div>

        <div className="p-6 mt-4 border-t border-zinc-900">
          <p className="text-xs text-zinc-500 leading-relaxed italic text-center">
            "Software Architect of Whisper Project. Driven by privacy and clean code."
          </p>
        </div>
      </ScrollArea>
    </div>
  );
};
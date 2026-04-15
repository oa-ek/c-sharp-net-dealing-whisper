import { useState } from "react";
import agent from "../../api/agent";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2, ShieldCheck } from "lucide-react";

export const ChangePasswordModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [data, setData] = useState({ old: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAction = async () => {
    if (data.new !== data.confirm) return alert("Паролі не збігаються");
    setLoading(true);
    try {
      await agent.Auth.changePassword({ currentPassword: data.old, newPassword: data.new });
      alert("Готово!");
      onClose();
    } catch {
      alert("Помилка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6 text-[#40C3CC]">
          <ShieldCheck className="w-6 h-6" />
          <h3 className="text-xl font-bold text-[#111]">Зміна пароля</h3>
        </div>
        <div className="space-y-4">
          <Input type="password" placeholder="Старий пароль" className="bg-gray-50 border-gray-200 text-[#111]" onChange={e => setData({...data, old: e.target.value})} />
          <Input type="password" placeholder="Новий пароль" className="bg-gray-50 border-gray-200 text-[#111]" onChange={e => setData({...data, new: e.target.value})} />
          <Input type="password" placeholder="Підтвердження" className="bg-gray-50 border-gray-200 text-[#111]" onChange={e => setData({...data, confirm: e.target.value})} />
        </div>
        <div className="flex gap-3 mt-8">
          <Button variant="ghost" className="flex-1 text-gray-500 hover:bg-gray-100" onClick={onClose}>Скасувати</Button>
          <Button className="flex-1 bg-whisper-gradient text-white border-none shadow-md hover:opacity-90" onClick={handleAction} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Оновити"}
          </Button>
        </div>
      </div>
    </div>
  );
};
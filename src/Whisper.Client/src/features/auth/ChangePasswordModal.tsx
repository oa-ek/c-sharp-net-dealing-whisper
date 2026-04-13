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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 text-emerald-500">
          <ShieldCheck className="w-6 h-6" />
          <h3 className="text-xl font-bold text-white">Зміна пароля</h3>
        </div>
        <div className="space-y-4">
          <Input type="password" placeholder="Старий пароль" className="bg-zinc-900 border-zinc-800" onChange={e => setData({...data, old: e.target.value})} />
          <Input type="password" placeholder="Новий пароль" className="bg-zinc-900 border-zinc-800" onChange={e => setData({...data, new: e.target.value})} />
          <Input type="password" placeholder="Підтвердження" className="bg-zinc-900 border-zinc-800" onChange={e => setData({...data, confirm: e.target.value})} />
        </div>
        <div className="flex gap-3 mt-8">
          <Button variant="ghost" className="flex-1 text-zinc-400" onClick={onClose}>Скасувати</Button>
          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleAction} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Оновити"}
          </Button>
        </div>
      </div>
    </div>
  );
};


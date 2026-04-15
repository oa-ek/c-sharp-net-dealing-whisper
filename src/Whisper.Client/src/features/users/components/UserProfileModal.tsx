import { useEffect, useState } from 'react';
import agent from '../../../api/agent';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import type { UpdateUserDto, UserDto } from '../../../types/user';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Loader2 } from 'lucide-react';

export const UserProfile = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [user, setUser] = useState<UserDto | null>(null);
    const [data, setData] = useState({ old: "", new: "", confirm: "" });
   

    const loadUser = async () => {
        try {
            const data = await agent.Users.me();
            setUser(data);
        } catch (err) {
            console.log(`Could not get the user: ${err}`);
        }
    }

    const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePasswordChange = async () => {
    if (data.new !== data.confirm) return alert("Паролі не збігаються");
    setLoading(true);
    try {
      await agent.Auth.changePassword({ currentPassword: data.old, newPassword: data.new });
      alert("Готово!");
    } catch {
      alert("Помилка");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    try {
        await agent.Users.mePut({
            displayName: user?.displayName,
            bio: user?.bio,
            pfpLink: user?.pfpLink
        } as UpdateUserDto);
            onClose();
        } catch (err) {
            console.log("Could not update user data" + err);
        }
    };

    useEffect(() => {
        loadUser();    
    }, []);



    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-8'>
            <div className='w-full max-w-3xl rounded-xl bg-linear-[135deg] from-[#64B59D] via-[#348F96] to-[#2D6BA3] overflow-hidden p-[3px]'>
                <div className='bg-white rounded-lg p-4'>
                    <div className='flex items-center gap-3 p-2'>
                        <div className='rounded-full p-1 bg-linear-'>
                            <Avatar className="w-42 h-42">
                                <AvatarFallback className="text-6xl bg-linear-[115deg] from-teal-300/60 to-sky-500/60 text-black uppercase">{user?.displayName.substring(0,2)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className='w-full'>
                            <div className='flex justify-between'>
                                <Input type="text" className='border-0 font-bold' style={{ fontSize: '22px'}}
                                    value={user?.displayName}
                                    onChange={e => setUser(prev => prev ? {...user, displayName: e.target.value} as UserDto : prev)}/>
                                <a onClick={handleClose} className='text-2xl font-bold cursor-pointer hover:text-zink-600'>✕</a>    
                            </div>
                            <p className='ml-2 text-sm'>@{user?.username}</p>
                            <p className='ml-2 test-xl mt-3 font-bold'>Bio:</p>
                            <textarea className='w-full rounded-xl p-2 ml-2 resize-none border-3 border-[#40c3cc] overflow-hidden' rows={3} maxLength={255}
                                onChange={e => setUser(prev => prev ? {...user, bio: e.target.value} as UserDto : prev)}/>
                        </div>
                    </div>
                    <div className='flex gap-3 mt-2'>
                        <div className='w-full space-y-2'>
                            <h2 className='text-2xl font-bold'>Privacy</h2>
                            <div className='flex justify-between'>
                                <p>Show last seen status</p>
                                <input type='checkbox' className='ring-cyan-300 rounded-xl'/>
                            </div>
                            <div className='w-full h-[1px] bg-[#40c3cc]/50' />
                            <div className='flex justify-between'>
                                <p>Show profile details</p>
                                <input type='checkbox' className='ring-cyan-300 rounded-xl'/>
                            </div>
                            <div className='w-full h-[1px] bg-[#40c3cc]/50' />
                            <div className='flex justify-between'>
                                <p>Allow being added to groups</p>
                                <input type='checkbox' className='ring-cyan-300 rounded-xl'/>
                            </div>
                            <div className='w-full h-[1px] bg-[#40c3cc]/50' />
                            <div className='flex justify-between'>
                                <p>Enable 2FA</p>
                                <input type='checkbox' className='ring-cyan-300 rounded-xl'/>
                            </div>
                        </div>
                        <div className='w-1 bg-[#40c3cc] rounded-xl' />
                        <div className='w-full space-y-2'>
                            <h2 className='text-2xl font-bold'>Password reset</h2>
                            <Input type="password" placeholder="Старий пароль" className="border-zinc-800" onChange={e => setData({...data, old: e.target.value})} />
                            <Input type="password" placeholder="Новий пароль" className="border-zinc-800" onChange={e => setData({...data, new: e.target.value})} />
                            <Input type="password" placeholder="Підтвердження" className="border-zinc-800" onChange={e => setData({...data, confirm: e.target.value})} />
                            <div className="flex gap-3 mt-8">
                                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handlePasswordChange} disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : "Змінити пароль"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
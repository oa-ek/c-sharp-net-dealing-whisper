import { useEffect, useState, useRef } from 'react';
import agent from '../../../api/agent';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import type { UpdateUserDto, UserDto } from '../../../types/user';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Loader2, Camera } from 'lucide-react';

export const UserProfile = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [user, setUser] = useState<UserDto | null>(null);
    const [data, setData] = useState({ old: "", new: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPfpUploading, setIsPfpUploading] = useState(false);
    const [pfpBlobUrl, setPfpBlobUrl] = useState<string>("");

    const loadUser = async () => {
        try {
            const data = await agent.Users.me();
            setUser(data);
        } catch (err) {
            console.log(`Could not get the user: ${err}`);
        }
    }

    useEffect(() => {
        let objectUrl = "";
        const fetchAvatar = async () => {
            if (!user?.pfpLink) {
                setPfpBlobUrl("");
                return;
            }

            try {
                const fileId = user.pfpLink.split("/").pop();
                if (!fileId) return;

                const blob = await agent.Media.download(fileId);
                objectUrl = URL.createObjectURL(blob);
                setPfpBlobUrl(objectUrl);
            } catch (err) {
                console.error("Помилка завантаження байтів аватарки:", err);
            }
        };

        if (user?.pfpLink) {
            fetchAvatar();
        }

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [user?.pfpLink]);

    useEffect(() => {
        if (isOpen) {
            const loadUser = async () => {
                try {
                    const userData = await agent.Users.me();
                    setUser(userData);
                } catch (err) {
                    console.log(`Error: ${err}`);
                }
            };
            loadUser();
        }
    }, [isOpen]); 

    if (!isOpen) return null;

    const handlePasswordChange = async () => {
        if (data.new !== data.confirm) return alert("Паролі не збігаються");
        setLoading(true);
        try {
            await agent.Auth.changePassword({ currentPassword: data.old, newPassword: data.new });
            alert("Готово!");
        } catch {
            
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

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsPfpUploading(true);
        try {
            const response = await agent.Media.upload(files[0]);
            const fileData = response.data || response;
            
            const uploadedUrl = fileData?.url || fileData?.Url;
            
            if (uploadedUrl) {
                setUser(prev => prev ? { ...prev, pfpLink: uploadedUrl } as UserDto : prev);
            }
        } catch (err) {
            console.error("Не вдалося завантажити аватар в MinIO:", err);
            alert("Помилка завантаження зображення.");
        } finally {
            setIsPfpUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-8'>
            <div className='w-full max-w-3xl rounded-xl bg-linear-[135deg] from-[#64B59D] via-[#348F96] to-[#2D6BA3] overflow-hidden p-[3px]'>
                <div className='bg-white rounded-lg p-4'>
                    <div className='flex items-center gap-3 p-2'>
                        <div className='rounded-full p-1 bg-linear- relative group cursor-pointer' onClick={() => !isPfpUploading && fileInputRef.current?.click()}>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleAvatarChange} 
                                className="hidden" 
                                style={{ display: 'none' }}
                                accept="image/*" 
                            />
                            <Avatar className="w-42 h-42 border-2 border-slate-100 transition-opacity group-hover:opacity-80">
                                {pfpBlobUrl ? (
                                    <img src={pfpBlobUrl} alt="PFP" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <AvatarFallback className="text-6xl bg-linear-[115deg] from-teal-300/60 to-sky-500/60 text-black uppercase">
                                        {user?.displayName?.slice(0, 2).toUpperCase() || "WP"}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity m-1">
                                {isPfpUploading ? (
                                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                                ) : (
                                    <Camera className="w-8 h-8 text-white" />
                                )}
                            </div>
                        </div>

                        <div className='w-full'>
                            <div className='flex justify-between'>
                                <Input type="text" className='border-0 font-bold' style={{ fontSize: '22px'} } placeholder="Display Name"
                                    value={user?.displayName || ""}
                                    onChange={e => setUser(prev => prev ? {...user, displayName: e.target.value} as UserDto : prev)}/>
                                <a onClick={handleClose} className='text-2xl font-bold cursor-pointer hover:text-zink-600'>✕</a>    
                            </div>
                            <p className='ml-2 text-sm'>@{user?.username}</p>
                            <p className='ml-2 test-xl mt-3 font-bold'>Bio:</p>
                            <textarea className='w-full rounded-xl p-2 ml-2 resize-none border-3 border-[#40c3cc] overflow-hidden' rows={3} maxLength={255}
                                value={user?.bio || ""}
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
                            <Input type="password" placeholder="Старий пароль" className="border-zinc-800" value={data.old} onChange={e => setData({...data, old: e.target.value})} />
                            <Input type="password" placeholder="Новий пароль" className="border-zinc-800" value={data.new} onChange={e => setData({...data, new: e.target.value})} />
                            <Input type="password" placeholder="Підтвердження" className="border-zinc-800" value={data.confirm} onChange={e => setData({...data, confirm: e.target.value})} />
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthInput } from '../../components/ui/AuthInput';
import { authApi } from '../../api/authApi';
import { db } from '../../api/db';
import type { LoginData } from '../../types/auth';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const authData = await db.auth.toCollection().first();
    
    if (!authData?.deviceId) {
      setError("Device not recognized. Please register first.");
      return;
    }

    try {
      const result = await authApi.login({
        email,
        password,
        deviceId: authData.deviceId
      });
      
      await db.auth.update(authData.deviceId, { 
        token: result.accessToken 
      });
      
      console.log('Token updated for account:', email);
      navigate('/chats');
    } catch (err: any) {
      setError(err.message || "Error occurred while logging in");
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
      {error && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-2 rounded">{error}</p>}
      <AuthInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <AuthInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="w-full py-3 mt-2 bg-white text-black font-black rounded-xl hover:bg-zinc-200 active:scale-95">
        DECRYPT SESSION
      </button>
    </form>
  );
};
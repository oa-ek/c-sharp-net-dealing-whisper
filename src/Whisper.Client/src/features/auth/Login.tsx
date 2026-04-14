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
      {error && (
        <p className="text-red-600 text-xs font-bold text-center bg-red-50 border border-red-100 py-3 rounded-xl animate-in fade-in zoom-in-95">
          {error}
        </p>
      )}

      <AuthInput 
        label="Email Address" 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
      />

      <AuthInput 
        label="Secure Password" 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
      />

      <button className="w-full py-4 mt-2 bg-linear-[135deg] from-[#64B59D] via-[#348F96] to-[#2D6BA3] text-white font-black rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-blue-200/50 uppercase tracking-wider">
        start Whispering...
      </button>
    </form>
  );
};
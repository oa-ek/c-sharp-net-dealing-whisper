import { useState } from 'react';
import { AuthInput } from '../../components/ui/AuthInput';
import { authApi } from '../../api/authApi';
import { useNavigate } from 'react-router-dom'; 
import type { LoginData } from '../../types/auth';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const storedDeviceId = localStorage.getItem('whisper_device_id');
    
    if (!storedDeviceId) {
      setError("Device not recognized. Please register first.");
      return;
    }

    try {
      const loginPayload: LoginData = {
        email,
        password,
        deviceId: storedDeviceId
      };

      const result = await authApi.login(loginPayload);
      
      localStorage.setItem('whisper_access_token', result.accessToken);
      localStorage.setItem('whisper_refresh_token', result.refreshToken);
      
      console.log('Login successful');
      navigate('/chats');
    } catch (err: any) {
      setError(err.message || "Error logging in");
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
      {error && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-2 rounded">{error}</p>}
      
      <AuthInput 
        label="Email" 
        type="email" 
        required
        value={email} 
        onChange={e => setEmail(e.target.value)} 
      />
      <AuthInput 
        label="Password" 
        type="password" 
        required
        value={password} 
        onChange={e => setPassword(e.target.value)} 
      />
      
      <button 
        type="submit" 
        className="w-full py-3 mt-2 bg-white text-black font-black rounded-xl hover:bg-zinc-200 transition-transform active:scale-95"
      >
        DECRYPT SESSION
      </button>
    </form>
  );
};
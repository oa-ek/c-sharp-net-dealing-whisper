import { useState } from 'react';
import { AuthInput } from '../../components/ui/AuthInput';
import { authApi } from '../../api/authApi';
import type { RegisterData } from '../../types/auth'; 
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Імітація ключів для X3DH протоколу
    const keys = {
      identity: "pub_id_" + btoa(Math.random().toString()).substring(0, 12),
      signed: "pub_signed_" + btoa(Math.random().toString()).substring(0, 12),
      preKeys: ["pre_1", "pre_2", "pre_3"]
    };

    try {
      const payload: RegisterData = {
        ...form,
        deviceName: "Web Client (Chrome)",
        deviceType: "Desktop",
        publicIdentityKey: keys.identity,
        signedPreKey: keys.signed,
        oneTimePreKeys: keys.preKeys
      };

      const result = await authApi.register(payload);
      
      localStorage.setItem('whisper_device_id', result.deviceId);
      
      console.log('Registration success, device registered');
      navigate('/auth/login');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full">
      <AuthInput 
        label="Username" 
        placeholder="@chicago"
        required
        onChange={e => setForm({...form, username: e.target.value})} 
      />
      <AuthInput 
        label="Email" 
        type="email" 
        required
        onChange={e => setForm({...form, email: e.target.value})} 
      />
      <AuthInput 
        label="Password" 
        type="password" 
        required
        onChange={e => setForm({...form, password: e.target.value})} 
      />
      
      <button 
        disabled={loading}
        className="w-full py-3 mt-2 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? "GENERATING KEYS..." : "INITIALIZE PROTOCOL"}
      </button>
    </form>
  );
};
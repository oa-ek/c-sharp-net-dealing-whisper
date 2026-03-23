import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthInput } from '../../components/ui/AuthInput';
import { authApi } from '../../api/authApi';
import { db } from '../../api/db';
import type { RegisterData } from '../../types/auth';

export const SignUp = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const keyBundle = {
      identity: { privateKey: "priv_id_" + Math.random(), publicKey: "pub_id_" + Math.random() },
      signedPreKey: { privateKey: "priv_sign_" + Math.random(), publicKey: "pub_sign_" + Math.random() },
      oneTimePreKeys: [
        { privateKey: "priv_otk_1", publicKey: "pub_otk_1" },
        { privateKey: "priv_otk_2", publicKey: "pub_otk_2" }
      ]
    };

    try {
      const payload: RegisterData = {
        ...form,
        deviceName: "Web Client",
        deviceType: "Desktop",
        publicIdentityKey: keyBundle.identity.publicKey,
        signedPreKey: keyBundle.signedPreKey.publicKey,
        oneTimePreKeys: keyBundle.oneTimePreKeys.map(k => k.publicKey)
      };

      const result = await authApi.register(payload);
      
      await db.auth.put({
        deviceId: result.deviceId,
        token: result.accessToken,
        identity: keyBundle.identity,
        signedPreKey: keyBundle.signedPreKey,
        oneTimePreKeys: keyBundle.oneTimePreKeys,
        chats: []
      });
      
      console.log('Identity initialized and saved to IndexedDB');
      navigate('/auth/login');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full">
      <AuthInput label="Username" placeholder="username" required onChange={e => setForm({...form, username: e.target.value})} />
      <AuthInput label="Email" type="email" required onChange={e => setForm({...form, email: e.target.value})} />
      <AuthInput label="Password" type="password" required onChange={e => setForm({...form, password: e.target.value})} />
      <button disabled={loading} className="w-full py-3 mt-2 bg-blue-600 text-white font-black rounded-xl active:scale-95 disabled:opacity-50">
        {loading ? "GENERATING..." : "INITIALIZE PROTOCOL"}
      </button>
    </form>
  );
};
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthInput } from '../../components/ui/AuthInput';
import { authApi } from '../../api/authApi';
import { db } from '../../api/db';
import type { RegisterData } from '../../types/auth';
import type { KeyPair, SignedKeyPair } from '../../types/db';

export const SignUp = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Емуляція генерації ключів (Identity Key та Signed PreKey)
    const identityKey: KeyPair = { 
      privateKey: "priv_id_" + Math.random().toString(36).substring(7), 
      publicKey: "pub_id_" + Math.random().toString(36).substring(7) 
    };

    // Тут ми створюємо SignedKeyPair — обов'язково з signature
    const signedPreKey: SignedKeyPair = { 
      privateKey: "priv_sign_" + Math.random().toString(36).substring(7), 
      publicKey: "pub_sign_" + Math.random().toString(36).substring(7),
      // У реальному X3DH ми підписуємо publicKey за допомогою identityKey.privateKey
      signature: "sig_" + btoa(Math.random().toString()).substring(0, 24) 
    };

    const oneTimePreKeys: KeyPair[] = [
      { privateKey: "priv_otk_1", publicKey: "pub_otk_1" },
      { privateKey: "priv_otk_2", publicKey: "pub_otk_2" }
    ];

    try {
      // 2. Готуємо payload для .NET сервера (з новим полем підпису)
      const payload: RegisterData = {
        ...form,
        deviceName: "Lenovo Legion 5", // Chicago, можеш сюди підставити реальну назву
        deviceType: "Desktop",
        publicIdentityKey: identityKey.publicKey,
        signedPreKey: signedPreKey.publicKey,
        signedPreKeySignature: signedPreKey.signature, // ТЕ САМЕ ПОЛЕ
        oneTimePreKeys: oneTimePreKeys.map(k => k.publicKey)
      };

      const result = await authApi.register(payload);
      
      // 3. Зберігаємо ПОВНУ сутність AuthEntity в IndexedDB
      await db.auth.put({
        deviceId: result.deviceId,
        token: result.accessToken,
        identity: identityKey,
        signedPreKey: signedPreKey, 
        oneTimePreKeys: oneTimePreKeys,
        chats: []
      });
      
      console.log('Protocol initialized. Signature saved to local DB.');
      navigate('/auth/login');
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full">
      <AuthInput 
        label="Username" 
        placeholder="username" 
        required 
        onChange={e => setForm({...form, username: e.target.value})} 
      />
      <AuthInput 
        label="Email" 
        type="email" 
        placeholder="your@email.com"
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
        className="w-full py-4 mt-2 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? "GENERATING SECURE IDENTITY..." : "INITIALIZE PROTOCOL"}
      </button>
    </form>
  );
};
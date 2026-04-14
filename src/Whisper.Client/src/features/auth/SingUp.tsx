import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthInput } from '../../components/ui/AuthInput';
import { AuthService } from '../../services/authService';
import { Loader2 } from 'lucide-react';

export const SignUp = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await AuthService.register(form.username, form.email, form.password);
      
      console.log('Protocol initialized. Identity and PreKeys secured.');
      
      navigate('/auth/login'); 
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Не вдалося ініціалізувати протокол захисту.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center animate-in fade-in zoom-in-95">
            {error}
          </div>
        )}

        <AuthInput 
          label="Username" 
          placeholder="your_whisper_name" 
          required 
          value={form.username}
          onChange={e => setForm({...form, username: e.target.value})} 
        />

        <AuthInput 
          label="Email" 
          type="email" 
          placeholder="your@email.com"
          required 
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})} 
        />

        <AuthInput 
          label="Password" 
          type="password" 
          placeholder="••••••••"
          required 
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})} 
        />
        
        <button 
          disabled={loading} 
          className="w-full py-4 mt-2 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>GENERATING SECURE IDENTITY...</span>
            </>
          ) : (
            "INITIALIZE PROTOCOL"
          )}
        </button>

        <p className="text-zinc-500 text-[10px] text-center uppercase tracking-widest font-medium mt-2">
          By initializing, you generate a unique E2EE identity bundle
        </p>
      </form>
    </div>
  );
};
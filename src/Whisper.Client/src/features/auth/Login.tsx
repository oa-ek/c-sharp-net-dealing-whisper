import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthInput } from '../../components/ui/AuthInput';
import agent from '../../api/agent'; 
import { db } from '../../api/db';
import { Loader2, ArrowLeft, ShieldCheck, Mail, Lock } from 'lucide-react';

type AuthMode = 'login' | 'forgot' | 'reset';

export const Login = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    const authData = await db.auth.toCollection().first();
    
    if (!authData || !authData.deviceId) {
      throw new Error("Пристрій не знайдено. Потрібна повторна реєстрація.");
    }

    const result = await agent.Auth.login({
      email: email.trim(),
      password: password,
      deviceId: authData.deviceId
    });

    if (!result.accessToken) {
      throw new Error("Сервер не повернув токен.");
    }

    const updatedAuthEntity = {
      ...authData,
      token: result.accessToken
    };

    await db.auth.put(updatedAuthEntity);
    
    const check = await db.auth.get(authData.id!); 
    console.log("Token check in DB:", check?.token ? "Success" : "Failed");

    if (!check?.token) {
      throw new Error("Не вдалося зберегти токен у локальну базу.");
    }

    navigate('/chats');
  } catch (err: any) {
    console.error("Login Error:", err);
    setError(err.response?.data?.message || err.message || "Помилка авторизації");
  } finally {
    setLoading(false);
  }
};

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await agent.Auth.forgotPassword(email);
      setMessage("Код підтвердження відправлено на вашу пошту.");
      setMode('reset'); 
    } catch (err: any) {
      setError("Не вдалося відправити код. Перевірте правильність Email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await agent.Auth.resetPassword({ 
        email, 
        code: code.trim(), 
        newPassword 
      });
      setMessage("Пароль змінено! Тепер ви можете увійти з новим паролем.");
      setMode('login');
      setPassword(''); 
    } catch (err: any) {
      setError(err.response?.data?.message || "Невірний код або термін дії вичерпано.");
    } finally {
      setLoading(false);
    }
  };

  const resetMessages = () => {
    setError(null);
    setMessage(null);
  };

  return (
    <div className="w-full space-y-4">
      {message && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold text-center animate-in fade-in zoom-in-95">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center animate-in fade-in zoom-in-95">
          {error}
        </div>
      )}

      <form 
        onSubmit={
          mode === 'login' ? handleLogin : 
          mode === 'forgot' ? handleRequestCode : 
          handleResetPassword
        } 
        className="flex flex-col gap-4 w-full"
      >
        {mode === 'login' && (
          <>
            <AuthInput 
              label="Email Address" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            <AuthInput 
              label="Secure Password" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            
            <button 
              type="button"
              onClick={() => { setMode('forgot'); resetMessages(); }}
              className="text-right text-[10px] font-black uppercase tracking-widest text-[#348F96] hover:text-[#2D6BA3] transition-colors -mt-2 mr-1"
            >
              Forgot Password?
            </button>

            <button 
              disabled={loading} 
              className="w-full py-4 mt-2 bg-linear-[135deg] from-[#64B59D] via-[#348F96] to-[#2D6BA3] text-white font-black rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-blue-200/20 uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "start Whispering..."}
            </button>
          </>
        )}

        {mode === 'forgot' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 text-[#348F96] px-1">
              <Mail className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Identity Recovery</span>
            </div>
            
            <AuthInput 
              label="Recovery Email" 
              type="email" 
              placeholder="Введіть ваш email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            
            <button 
              disabled={loading} 
              className="w-full py-4 bg-linear-[135deg] from-[#64B59D] via-[#348F96] to-[#2D6BA3] text-white font-black rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-blue-200/20 uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Code"}
            </button>

            <button 
              type="button" 
              onClick={() => { setMode('login'); resetMessages(); }} 
              className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600 transition-colors w-full"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Login
            </button>
          </div>
        )}

        {mode === 'reset' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 text-[#2D6BA3] px-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Security Challenge</span>
            </div>

            <AuthInput 
              label="6-Digit Verification Code" 
              type="text" 
              placeholder="000000" 
              maxLength={6} 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              required 
            />

            <AuthInput 
              label="New Secure Password" 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              required 
            />
            
            <button 
              disabled={loading} 
              className="w-full py-4 bg-linear-[135deg] from-[#64B59D] via-[#348F96] to-[#2D6BA3] text-white font-black rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-blue-200/20 uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Update"}
            </button>

            <button 
              type="button" 
              onClick={() => { setMode('forgot'); resetMessages(); }} 
              className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#348F96] transition-colors w-full"
            >
              Код не прийшов? Спробувати ще раз
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
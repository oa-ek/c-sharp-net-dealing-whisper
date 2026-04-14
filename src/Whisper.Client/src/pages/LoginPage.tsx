import { Login } from '../features/auth/Login';
import { Link } from 'react-router-dom'; 

const LoginPage = () => {
  return (
    <div className="w-full max-w-md mx-auto space-y-8 p-8 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-[#111] tracking-tighter">
          Welcome back
        </h1>
        <p className="text-sm text-gray-400 font-medium">
          Enter your credentials to access secured chats
        </p>
      </div>

      <Login />

      <div className="pt-2">
        <p className="text-center text-sm text-gray-500 font-medium">
          New to Whisper?{' '}
          <Link 
            to="/auth/signup" 
            className="text-[#3E93E6] font-bold hover:text-[#40C3CC] transition-colors underline underline-offset-4"
          >
            Create identity
          </Link>
        </p>
      </div>
      
      <div className="flex justify-center items-center gap-2 opacity-20">
        <div className="h-[1px] w-8 bg-gray-300" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">E2EE</span>
        <div className="h-[1px] w-8 bg-gray-300" />
      </div>
    </div>
  );
};

export default LoginPage;
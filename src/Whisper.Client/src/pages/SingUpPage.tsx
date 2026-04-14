import { SignUp } from '../features/auth/SingUp';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  return (
    <div className="w-full max-w-md mx-auto space-y-8 p-8 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-black tracking-tighter text-[#111]">
          New Identity
        </h2>
        <p className="text-sm text-gray-400 font-medium">
          Create keys and join the secure network
        </p>
      </div>

      <SignUp />

      <div className="pt-2">
        <p className="text-center text-sm text-gray-500 font-medium">
          Already have a session?{' '}
          <Link 
            to="/auth/login" 
            className="text-[#3E93E6] font-bold hover:text-[#40C3CC] transition-all underline underline-offset-4"
          >
            Decrypt here
          </Link>
        </p>
      </div>

      <div className="flex justify-center items-center gap-2 opacity-20">
        <div className="h-[1px] w-8 bg-gray-300" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Secure</span>
        <div className="h-[1px] w-8 bg-gray-300" />
      </div>
    </div>
  );
};

export default SignUpPage;
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 selection:bg-blue-500/30">
      <div className="w-full max-w-[400px] bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded">
            Whisper Protocol
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
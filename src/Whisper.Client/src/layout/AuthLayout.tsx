import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] p-6 selection:bg-[#348F96]/20">
      
      {/* <div className="w-full max-w-[440px] bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/5 animate-in fade-in duration-700">
        
        <div className="flex justify-center mb-10">
          <div className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full shadow-sm">
            <span className="text-[15px] text-black font-bold uppercase tracking-[0.3em] bg-gradient-to-r from-[#64B59D] via-[#348F96] to-[#2D6BA3] bg-clip-text text-transparent">
              Whisper Protocol
            </span>
          </div>
        </div>
        
      </div> */}
      <div className="relative">
          <Outlet />
        </div>
    </div>
  );
};

export default AuthLayout;
import type { InputHTMLAttributes } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const AuthInput = ({ label, ...props }: AuthInputProps) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black ml-1.5">
        {label}
      </label>
      
      <input 
        {...props} 
        className="w-full px-4 py-3.5 rounded-2xl bg-gray-100 border border-gray-100 
                   text-slate-900 placeholder:text-gray-300 font-medium
                   focus:border-[#348F96]/50 focus:ring-4 focus:ring-[#348F96]/5 
                   focus:bg-white outline-none transition-all duration-300 
                   shadow-sm shadow-blue-900/5"
      />
    </div>
  );
};
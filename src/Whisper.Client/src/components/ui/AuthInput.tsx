import type { InputHTMLAttributes } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const AuthInput = ({ label, ...props }: AuthInputProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold ml-1">
        {label}
      </label>
      <input 
        {...props} 
        className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 
                   text-white placeholder:text-zinc-600
                   focus:border-white focus:ring-1 focus:ring-white 
                   outline-none transition-all duration-200"
      />
    </div>
  );
};
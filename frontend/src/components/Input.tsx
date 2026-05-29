import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Input: React.FC<InputProps> = ({ label, ...rest }) => {
    return (
        <div className='flex flex-col gap-1 w-full mb-4'>
            <label className='text-sm font-medium text-slate-700'>{label}</label>
            <input 
              {...rest}
              className='px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-slate-900 shadow-sm'
            />
        </div>
    )
} 


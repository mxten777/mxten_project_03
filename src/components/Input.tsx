import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input
      className={`border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${error ? 'border-red-400' : 'border-gray-300'} ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </div>
);

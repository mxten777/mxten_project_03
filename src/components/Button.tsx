import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

const base = 'px-4 py-2 rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-300';
const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => (
  <button
    className={`${base} ${variants[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

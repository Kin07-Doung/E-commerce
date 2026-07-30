import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm',
    warning: 'bg-orange-600 text-white hover:bg-orange-700 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    ghost: 'text-slate-600 hover:text-slate-800 hover:bg-slate-100',
    outline: 'border border-slate-200 text-slate-700 hover:bg-slate-50',
    text: 'text-slate-600 hover:text-slate-800',
    textPrimary: 'text-blue-600 hover:text-blue-700',
    textDanger: 'text-red-600 hover:text-red-700',
    textSuccess: 'text-green-600 hover:text-green-700',
    sidebar: 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
    icon: 'w-6 h-6 p-0 text-xs',
    none: '',
  };

  return (
    <button className={`${base} ${variants[variant] || ''} ${sizes[size] || ''} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;

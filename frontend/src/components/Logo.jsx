import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = '' }) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <svg className="w-8 h-8 text-blue-600" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="10" width="32" height="26" rx="4" fill="currentColor" />
        <path d="M12 10V7a8 8 0 0 1 16 0v3" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="16" cy="24" r="2.5" fill="white" />
        <circle cx="24" cy="24" r="2.5" fill="white" />
        <path d="M13 18h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="text-xl font-bold text-blue-600 tracking-tight">ShopHub</span>
    </Link>
  );
};

export default Logo;

import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false, text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-6">
          {/* Food-themed loading animation */}
          <div className="relative">
            {/* Main spinner */}
            <div className={`${spinnerSize} border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin`} />
            
            {/* Food emoji in center */}
            <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
              🍽️
            </div>
          </div>
          
          {/* Loading text with dots animation */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1 text-lg font-semibold text-orange-600">
              <span>{text}</span>
              <span className="animate-bounce delay-0">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </div>
            <p className="text-sm text-amber-600">Preparing your food experience</p>
          </div>

          {/* Decorative food icons rotating */}
          <div className="flex gap-4 text-2xl">
            <span className="animate-bounce delay-0">🍕</span>
            <span className="animate-bounce delay-100">🍔</span>
            <span className="animate-bounce delay-200">🌮</span>
            <span className="animate-bounce delay-300">🍣</span>
            <span className="animate-bounce delay-400">🥗</span>
          </div>
        </div>
      </div>
    );
  }

  // Regular spinner (inline)
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="relative">
        {/* Main spinner */}
        <div className={`${spinnerSize} border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin`} />
        
        {/* Food emoji in center */}
        <div className="absolute inset-0 flex items-center justify-center text-xl animate-pulse">
          🍽️
        </div>
      </div>
      
      <div className="flex items-center gap-1 text-sm font-medium text-orange-600">
        <span>{text}</span>
        <span className="animate-bounce delay-0">.</span>
        <span className="animate-bounce delay-150">.</span>
        <span className="animate-bounce delay-300">.</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
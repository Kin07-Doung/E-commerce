import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false, text = 'Loading…' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-10 w-10 border-2',
    xl: 'h-12 w-12 border-[3px]',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  const spinner = (
    <div
      className={`${spinnerSize} animate-spin rounded-full border-gray-200 border-t-orange-500`}
      role="status"
      aria-label={text}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          {text && (
            <p className="text-sm text-gray-500">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      {spinner}
      {text && (
        <p className="text-sm text-gray-500">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
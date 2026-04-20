import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-[3px]',
    lg: 'w-14 h-14 border-[3px]',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} rounded-full border-surface-700 border-t-brand-500 animate-spin`}
        style={{ animation: 'spin 0.8s linear infinite' }}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;

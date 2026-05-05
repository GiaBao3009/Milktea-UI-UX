import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => (
  <div
    className={`animate-spin rounded-full border-2 border-gray-200 border-t-brand-500 ${sizes[size]} ${className}`}
  />
);

export default LoadingSpinner;

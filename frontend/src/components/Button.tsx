import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  onClick,
  disabled,
  className = '',
}: any) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-600 hover:to-primary-500 text-white shadow-lg shadow-primary-700/30',
    secondary: 'bg-surface-750 border border-border-20 text-text-80 hover:bg-surface-700',
    outline: 'bg-transparent border border-border-20 text-text-80 hover:bg-surface-700',
    tertiary: 'bg-transparent text-primary-500 hover:bg-primary-500/10',
    danger: 'bg-gradient-to-r from-error to-error/80 text-white shadow-lg shadow-error/30',
    warning: 'bg-warning-500/20 text-warning-400 border border-warning-500/30 hover:bg-warning-500/30',
    success: 'bg-success-500/20 text-success-400 border border-success-500/30 hover:bg-success-500/30',
  };

  const sizes: Record<string, string> = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-sm',
    lg: 'h-12 px-8 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}

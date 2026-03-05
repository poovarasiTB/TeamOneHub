import React from 'react';

export function Badge({ children, variant = 'default' }: any) {
  const variants: Record<string, string> = {
    default: 'bg-bg-600 text-text-400',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    error: 'bg-error/20 text-error',
    info: 'bg-info/20 text-info',
    primary: 'bg-primary-500/20 text-primary-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

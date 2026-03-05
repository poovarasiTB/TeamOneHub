import React from 'react';

export function Card({ children, className = '' }: any) {
  return (
    <div className={`bg-surface-800 rounded-2xl border border-border-12 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: any) {
  return (
    <div className={`px-6 py-4 border-b border-border-12 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: any) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

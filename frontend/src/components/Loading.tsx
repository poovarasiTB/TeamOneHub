import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-primary-500`}
      ></div>
    </div>
  );
}

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = 'Loading...' }: LoadingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-900">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-text-400">{message}</p>
      </div>
    </div>
  );
}

interface LoadingCardProps {
  lines?: number;
}

export function LoadingCard({ lines = 3 }: LoadingCardProps) {
  return (
    <div className="bg-surface-800 rounded-2xl p-6 border border-border-12 animate-pulse">
      <div className="h-6 bg-bg-700 rounded w-1/3 mb-4"></div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-bg-700 rounded w-full mb-2"></div>
      ))}
    </div>
  );
}

interface LoadingTableProps {
  rows?: number;
  columns?: number;
}

export function LoadingTable({ rows = 5, columns = 4 }: LoadingTableProps) {
  return (
    <div className="bg-surface-800 rounded-2xl border border-border-12 overflow-hidden">
      <div className="bg-bg-800 px-6 py-4">
        <div className="h-4 bg-bg-700 rounded w-1/4"></div>
      </div>
      <div className="divide-y divide-border-12">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 animate-pulse">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, j) => (
                <div key={j} className="h-4 bg-bg-700 rounded flex-1"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LoadingGridProps {
  items?: number;
}

export function LoadingGrid({ items = 6 }: LoadingGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: items }).map((_, i) => (
        <LoadingCard key={i} lines={4} />
      ))}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-bg-700 rounded ${className}`}></div>;
}

export default {
  LoadingSpinner,
  LoadingPage,
  LoadingCard,
  LoadingTable,
  LoadingGrid,
  Skeleton,
};

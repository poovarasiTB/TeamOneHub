import React from 'react';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-900">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}

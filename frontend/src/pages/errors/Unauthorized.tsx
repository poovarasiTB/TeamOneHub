import React from 'react';
import { Link } from 'react-router-dom';

export function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-900">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-text-100 mb-4">401</h1>
        <h2 className="text-3xl font-bold text-text-100 mb-4">Unauthorized</h2>
        <p className="text-text-400 mb-8">You don't have permission to access this page.</p>
        <Link to="/">
          <button className="px-8 py-4 bg-primary-700 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary-700/30">
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}

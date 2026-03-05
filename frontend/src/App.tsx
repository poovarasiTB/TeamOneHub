import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RetryBoundary } from '@/components/RetryBoundary';

// Layouts
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';

// Auth Pages
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';

// Main Pages
import { Dashboard } from '@/pages/Dashboard';

// Hub Pages
import { WorkHub } from '@/hubs/work/WorkHub';
import { PeopleHub } from '@/hubs/people/PeopleHub';
import { MoneyHub } from '@/hubs/money/MoneyHub';
import { AssetsHub } from '@/hubs/assets/AssetsHub';
import { SupportHub } from '@/hubs/support/SupportHub';
import { GrowthHub } from '@/hubs/growth/GrowthHub';
import { AdminHub } from '@/hubs/admin/AdminHub';

// Settings Pages
import { Profile } from '@/pages/settings/Profile';
import { Settings } from '@/pages/settings/Settings';

// Error Pages
import { NotFound } from '@/pages/errors/NotFound';
import { Unauthorized } from '@/pages/errors/Unauthorized';

// Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Error Fallback Component
function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-900">
      <div className="text-center max-w-md p-8">
        <h1 className="text-4xl font-bold text-error mb-4">Something Went Wrong</h1>
        <p className="text-text-400 mb-6">
          We're sorry for the inconvenience. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary-700 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <RetryBoundary maxRetries={3}>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Error Pages */}
          <Route path="/404" element={<NotFound />} />
          <Route path="/401" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Hubs */}
            <Route path="/work/*" element={<WorkHub />} />
            <Route path="/people/*" element={<PeopleHub />} />
            <Route path="/money/*" element={<MoneyHub />} />
            <Route path="/assets/*" element={<AssetsHub />} />
            <Route path="/support/*" element={<SupportHub />} />
            <Route path="/growth/*" element={<GrowthHub />} />
            <Route path="/admin/*" element={<AdminHub />} />

            {/* Settings */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a3e',
              color: '#e8e8e8',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#4ecdc4',
                secondary: '#1a1a3e',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff6b8a',
                secondary: '#1a1a3e',
              },
            },
          }}
        />
      </RetryBoundary>
    </ErrorBoundary>
  );
}

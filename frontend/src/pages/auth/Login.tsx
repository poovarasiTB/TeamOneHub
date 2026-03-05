import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { validateForm, loginSchema } from '../../utils/validation';
import { LoadingSpinner } from '../../components/Loading';

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationErrors({});

    // Validate form
    const validation = validateForm(loginSchema, formData);
    
    if (!validation.success) {
      setValidationErrors(validation.errors || {});
      return;
    }

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      
      // Redirect to stored URL or dashboard
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      // Error handled by store
    }
  };

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validationErrors]);

  return (
    <div className="bg-surface-800 rounded-2xl p-8 shadow-xl border border-border-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-100 mb-2">TeamOne</h1>
        <p className="text-text-400">Sign in to your account</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-600 mb-2">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
              validationErrors.email ? 'border-error' : 'border-border-12'
            }`}
            placeholder="you@company.com"
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-error">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-600 mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
              validationErrors.password ? 'border-error' : 'border-border-12'
            }`}
            placeholder="••••••••"
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-error">{validationErrors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-border-20 bg-bg-800 text-primary-500 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-text-400">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-600 hover:to-primary-500 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-700/30 hover:shadow-primary-600/40 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-border-12">
        <div className="text-center">
          <p className="text-sm text-text-400 mb-4">Demo Credentials</p>
          <div className="bg-bg-800 rounded-lg p-3 text-left">
            <p className="text-xs text-text-400">
              <span className="text-text-600">Email:</span> admin@teamone.local
            </p>
            <p className="text-xs text-text-400">
              <span className="text-text-600">Password:</span> Admin123!
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-text-400">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

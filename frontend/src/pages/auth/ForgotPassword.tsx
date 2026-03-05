import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setIsSent(true);
      toast.success('Password reset link sent! Check your email.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="bg-surface-800 rounded-2xl p-8 shadow-xl border border-border-12 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-text-100 mb-2">Check Your Email</h1>
          <p className="text-text-400 mb-6">
            We've sent a password reset link to <strong className="text-text-100">{email}</strong>
          </p>
          <p className="text-sm text-text-500 mb-6">
            Didn't receive the email? Check your spam folder or try again.
          </p>
        </div>
        <div className="space-y-3">
          <Button variant="primary" className="w-full" onClick={() => setIsSent(false)}>
            Send Another Link
          </Button>
          <Link to="/login">
            <Button variant="secondary" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-800 rounded-2xl p-8 shadow-xl border border-border-12 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🔑</div>
        <h1 className="text-2xl font-bold text-text-100 mb-2">Forgot Password</h1>
        <p className="text-text-400">Enter your email and we'll send you a reset link</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-text-400 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-4 py-3 bg-bg-800 border border-border-12 rounded-xl text-text-100 placeholder-text-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
          Send Reset Link
        </Button>

        <div className="text-center">
          <Link to="/login" className="text-sm text-text-400 hover:text-text-100 transition-colors">
            ← Back to Login
          </Link>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-border-12">
        <p className="text-xs text-text-500 text-center">
          Remember your password?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

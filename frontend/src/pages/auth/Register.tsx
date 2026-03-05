import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { validateForm, registerSchema } from '../../utils/validation';
import { LoadingSpinner } from '../../components/Loading';

export function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    tenantName: '',
    acceptTerms: false,
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationErrors({});

    // Validate form
    const validation = validateForm(registerSchema, formData);
    
    if (!validation.success) {
      setValidationErrors(validation.errors || {});
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        tenantName: formData.tenantName,
      });
      toast.success('Registration successful!');
      navigate('/dashboard');
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

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="bg-surface-800 rounded-2xl p-8 shadow-xl border border-border-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-100 mb-2">Create Account</h1>
        <p className="text-text-400">Start your 14-day free trial</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-600 mb-2">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
              validationErrors.name ? 'border-error' : 'border-border-12'
            }`}
            placeholder="John Doe"
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-error">{validationErrors.name}</p>
          )}
        </div>

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
          <label htmlFor="tenantName" className="block text-sm font-medium text-text-600 mb-2">
            Company Name
          </label>
          <input
            id="tenantName"
            name="tenantName"
            type="text"
            required
            value={formData.tenantName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
              validationErrors.tenantName ? 'border-error' : 'border-border-12'
            }`}
            placeholder="Acme Inc."
          />
          {validationErrors.tenantName && (
            <p className="mt-1 text-sm text-error">{validationErrors.tenantName}</p>
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
            autoComplete="new-password"
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
          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded ${
                      level <= passwordStrength
                        ? level <= 2
                          ? 'bg-error'
                          : level <= 4
                          ? 'bg-warning'
                          : 'bg-success'
                        : 'bg-bg-700'
                    }`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-text-400 mt-1">
                Password strength: {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 4 ? 'Medium' : 'Strong'}
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-600 mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-bg-800 border rounded-xl text-text-80 placeholder-text-40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
              validationErrors.confirmPassword ? 'border-error' : 'border-border-12'
            }`}
            placeholder="••••••••"
          />
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-error">{validationErrors.confirmPassword}</p>
          )}
        </div>

        <div>
          <label className="flex items-start">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              className="w-4 h-4 mt-0.5 rounded border-border-20 bg-bg-800 text-primary-500 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-text-400">
              I agree to the{' '}
              <a href="#" className="text-primary-400 hover:text-primary-300">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-400 hover:text-primary-300">
                Privacy Policy
              </a>
            </span>
          </label>
          {validationErrors.acceptTerms && (
            <p className="mt-1 text-sm text-error">{validationErrors.acceptTerms}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-600 hover:to-primary-500 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-700/30 hover:shadow-primary-600/40 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-border-12 text-center">
        <p className="text-sm text-text-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

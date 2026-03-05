import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Register } from '../pages/auth/Register';
import { useAuthStore } from '../store/authStore';

vi.mock('../store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Register', () => {
  const mockRegister = vi.fn();
  const mockClearError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    });
  });

  it('renders registration form correctly', () => {
    render(<Register />, { wrapper: createWrapper() });

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /i agree/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows validation error for invalid name', async () => {
    render(<Register />, { wrapper: createWrapper() });

    const nameInput = screen.getByLabelText(/full name/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(nameInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name can only contain letters/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    render(<Register />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('shows password strength indicator', async () => {
    render(<Register />, { wrapper: createWrapper() });

    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(passwordInput, { target: { value: 'Weak' } });

    await waitFor(() => {
      expect(screen.getByText(/password strength:/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when passwords do not match', async () => {
    render(<Register />, { wrapper: createWrapper() });

    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password456!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when terms not accepted', async () => {
    render(<Register />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/you must accept the terms/i)).toBeInTheDocument();
    });
  });

  it('calls register with correct data', async () => {
    mockRegister.mockResolvedValueOnce({});

    render(<Register />, { wrapper: createWrapper() });

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/company name/i), { target: { value: 'Acme Inc' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /i agree/i }));
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        tenantName: 'Acme Inc',
      });
    });
  });

  it('shows loading state when submitting', async () => {
    mockRegister.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)));

    render(<Register />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(<Register />, { wrapper: createWrapper() });

    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute('type', 'password');
  });
});

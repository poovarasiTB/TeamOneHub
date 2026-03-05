import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from '../components/ErrorBoundary';

describe('ErrorBoundary', () => {
  const MockComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
      throw new Error('Test error');
    }
    return <div>Success</div>;
  };

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <MockComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders fallback when there is an error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <MockComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary onError={onError}>
        <MockComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it('can reset error state', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <ErrorBoundary>
        <MockComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(tryAgainButton);

    rerender(
      <ErrorBoundary>
        <MockComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Success')).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>Custom Fallback</div>}>
        <MockComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Fallback')).toBeInTheDocument();

    consoleError.mockRestore();
  });
});

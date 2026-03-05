import React from 'react';

interface RetryBoundaryProps {
  children: React.ReactNode;
  maxRetries?: number;
  onRetry?: () => void;
  fallback?: React.ReactNode;
}

interface RetryBoundaryState {
  hasError: boolean;
  retryCount: number;
}

/**
 * RetryBoundary - Automatically retries failed components
 * Useful for network requests, API calls, etc.
 */
export class RetryBoundary extends React.Component<
  RetryBoundaryProps,
  RetryBoundaryState
> {
  constructor(props: RetryBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(_: Error): Partial<RetryBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('RetryBoundary caught error:', error, errorInfo);
  }

  handleRetry = () => {
    const maxRetries = this.props.maxRetries || 3;
    
    if (this.state.retryCount < maxRetries) {
      this.setState({
        hasError: false,
        retryCount: this.state.retryCount + 1,
      });
      
      if (this.props.onRetry) {
        this.props.onRetry();
      }
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.state.retryCount >= (this.props.maxRetries || 3)) {
        // Max retries reached, show fallback
        if (this.props.fallback) {
          return this.props.fallback;
        }

        return (
          <div className="p-6 bg-error/10 border border-error/20 rounded-xl">
            <h3 className="text-lg font-semibold text-error mb-2">
              Unable to Load
            </h3>
            <p className="text-text-400 mb-4">
              We've tried multiple times but couldn't load this content.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-primary-700 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      }

      // Auto-retry
      setTimeout(this.handleRetry, 1000 * (this.state.retryCount + 1));

      return (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-400">
            Retrying... ({this.state.retryCount}/{this.props.maxRetries || 3})
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * useRetry Hook - For functional components
 */
export function useRetry<T>(
  fetchFunction: () => Promise<T>,
  maxRetries: number = 3
): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  retryCount: number;
  retry: () => void;
} {
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      if (retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1);
        // Exponential backoff
        setTimeout(fetchData, 1000 * Math.pow(2, retryCount));
      } else {
        setError(err as Error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, maxRetries, retryCount]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const retry = () => {
    setRetryCount(0);
    fetchData();
  };

  return { data, isLoading, error, retryCount, retry };
}

export default RetryBoundary;

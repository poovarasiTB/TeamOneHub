import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to error reporting service (e.g., Sentry)
    // Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public reset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-900">
          <div className="text-center max-w-md p-8">
            <h1 className="text-4xl font-bold text-error mb-4">Oops!</h1>
            <p className="text-text-400 mb-6">
              Something went wrong. Don't worry, our team has been notified.
            </p>
            {this.state.error && (
              <details className="text-left bg-bg-800 rounded-lg p-4 mb-6">
                <summary className="cursor-pointer text-text-600 mb-2">
                  Error Details
                </summary>
                <pre className="text-xs text-error whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.reset}
              className="px-6 py-3 bg-primary-700 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

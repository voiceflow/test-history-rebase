import LogRocket from 'logrocket';
import React from 'react';
import { Link } from 'react-router-dom';

import Error from './Error';
import { ErrorBoundaryWrapper } from './styled';

interface ErrorBoundaryProps {
  show?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = {
    hasError: false,
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (!error) return;

    LogRocket.captureException(error, {
      extra: {
        stack: errorInfo.componentStack,
      },
    });

    this.setState({ hasError: true });
  }

  render(): React.ReactNode {
    const { hasError } = this.state;
    const { show, children } = this.props;

    if (hasError || show) {
      return (
        <ErrorBoundaryWrapper>
          <Error message="Something went wrong, return to dashboard.">
            <Link to="/" className="btn btn-primary mt-3">
              Dashboard
            </Link>
          </Error>
        </ErrorBoundaryWrapper>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

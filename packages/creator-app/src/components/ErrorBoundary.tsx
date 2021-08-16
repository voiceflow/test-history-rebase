import { ErrorBoundaryWrapper, LegacyButton, PageError } from '@voiceflow/ui';
import LogRocket from 'logrocket';
import React from 'react';
import { Link } from 'react-router-dom';

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
          <PageError message="Please return to dashboard. If the issue continues, please contact support.">
            <Link to="/">
              <LegacyButton isPrimary>Dashboard</LegacyButton>
            </Link>
          </PageError>
        </ErrorBoundaryWrapper>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

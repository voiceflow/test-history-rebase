import { Button, ButtonVariant, ErrorBoundaryWrapper, PageError, System } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';

interface ErrorBoundaryProps extends React.PropsWithChildren {
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

    client.log.captureException(error, errorInfo);

    this.setState({ hasError: true });
  }

  render(): React.ReactNode {
    const { hasError } = this.state;
    const { show, children } = this.props;

    if (hasError || show) {
      return (
        <ErrorBoundaryWrapper>
          <PageError message="Please return to dashboard. If the issue continues, please contact support.">
            <System.Link.Router to="/">
              <Button variant={ButtonVariant.PRIMARY}>Dashboard</Button>
            </System.Link.Router>
          </PageError>
        </ErrorBoundaryWrapper>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

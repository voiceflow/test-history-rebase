import { datadogRum } from '@datadog/browser-rum';
import { Button, ButtonVariant, ErrorBoundaryWrapper, LOGROCKET_ENABLED, PageError, System } from '@voiceflow/ui';
import LogRocket from 'logrocket';
import React from 'react';

interface ErrorBoundaryProps extends React.PropsWithChildren {
  show?: boolean;
  useLogrocket?: boolean;
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

    if (LOGROCKET_ENABLED) {
      LogRocket.captureException(error, {
        extra: {
          stack: errorInfo.componentStack,
        },
      });
    } else {
      datadogRum.addError(error, errorInfo);
    }

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

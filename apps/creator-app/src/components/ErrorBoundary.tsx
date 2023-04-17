import { datadogRum } from '@datadog/browser-rum';
import { Button, ButtonVariant, ErrorBoundaryWrapper, PageError } from '@voiceflow/ui';
import React from 'react';
import { Link } from 'react-router-dom';

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

    datadogRum.addError(error, errorInfo);

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
              <Button variant={ButtonVariant.PRIMARY}>Dashboard</Button>
            </Link>
          </PageError>
        </ErrorBoundaryWrapper>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

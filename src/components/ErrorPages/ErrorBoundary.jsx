import LogRocket from 'logrocket';
import React from 'react';
import { Link } from 'react-router-dom';

import { userSelector } from '@/ducks/account';
import { connect } from '@/hocs';

import Error from './Error';
import { ErrorBoundaryWrapper } from './styled';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(rawError, info) {
    if (!rawError) return;
    LogRocket.captureException(rawError, {
      extra: {
        stack: info.componentStack,
      },
    });
    this.setState({
      hasError: true,
    });
  }

  render() {
    if (this.state.hasError || this.props.show) {
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
    return this.props.children;
  }
}

const mapStateToProps = {
  user: userSelector,
};

export default connect(mapStateToProps)(ErrorBoundary);

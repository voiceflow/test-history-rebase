import LogRocket from 'logrocket';
import React from 'react';
import { Link } from 'react-router-dom';

import SvgIcon from '@/components/SvgIcon';
import { userSelector } from '@/ducks/account';
import { connect } from '@/hocs';

import { ErrorBoundaryWrapper, Page404Wrapper } from './styled';

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
          <Page404Wrapper>
            <div>
              <SvgIcon icon="error500" height={80} width={80} />
            </div>

            <label className="mt-3 dark">Alexa, what happened?</label>

            <p className="mt-1 mb-2">Something went wrong, return to dashboard.</p>

            <Link to="/" className="btn btn-primary mt-3">
              Dashboard
            </Link>
          </Page404Wrapper>
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

import LogRocket from 'logrocket';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import SvgIcon from '@/components/SvgIcon';

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
              <SvgIcon icon="error500" height={128} width={128} />
            </div>

            <h4>Alexa, what happened?</h4>

            <p>Something went wrong. Try reloading the page</p>

            <Link to="/" className="btn btn-primary mt-3">
              Go to Dashboard
            </Link>
          </Page404Wrapper>
        </ErrorBoundaryWrapper>
      );
    }
    return this.props.children;
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
});

export default connect(mapStateToProps)(ErrorBoundary);

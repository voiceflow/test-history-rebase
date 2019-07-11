import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import serializeError from 'serialize-error';

import { getDevice } from '@/Helper';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(rawError, info) {
    if (!rawError) return;

    const error = serializeError(rawError);
    axios.post('/errors', {
      name: error.name,
      message: error.message,
      error: error.stack,
      componentTree: info.componentStack,
      browser: getDevice(),
      user_detail: this.props.user,
    });
    this.setState({
      hasError: true,
    });
  }

  render() {
    if (this.state.hasError || this.props.show) {
      return (
        <div className="h-100 w-100 super-center">
          <div className="text-center">
            <h1>Whoops, something went wrong, please return to home</h1>
            <Link to="/" className="btn btn-primary mt-3">
              <i className="far fa-long-arrow-left mr-2" />
              Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
});

export default connect(mapStateToProps)(ErrorBoundary);

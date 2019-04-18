import React, { Fragment, Component } from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

import Loader from 'components/Loader';

export default ({ text, hideKeys, isFullscreen = true }) => Wrapper =>
  class WithProcessingLoader extends Component {
    static displayName = wrapDisplayName(Wrapper, 'WithProcessingLoader');

    static getDerivedStateFromProps(props, { hideValues }) {
      if (hideKeys.some(key => props[key] !== hideValues[key])) {
        return {
          hideValues: hideKeys.reduce((obj, key) => ({ ...obj, [key]: props[key] }), {}),
          processing: false,
          showLoader: false,
        };
      }

      return null;
    }

    state = {
      processing: false,
      showLoader: false,
      hideValues: {},
    };

    onStart = ({ showLoader = false } = {}) => {
      this.setState({ showLoader, processing: true });
    };

    onFinish = () => {
      this.setState({ processing: false, showLoader: false });
    };

    render() {
      const { processing, showLoader } = this.state;

      return (
        <Fragment>
          {showLoader && <Loader text={text} pending={processing} isFullscreen={isFullscreen} />}

          <Wrapper
            {...this.props}
            startProcessingLoader={this.onStart}
            finishProcessingLoader={this.onFinish}
            processingLoaderInProgress={processing}
          />
        </Fragment>
      );
    }
  };

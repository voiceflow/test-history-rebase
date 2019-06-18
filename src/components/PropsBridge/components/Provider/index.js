/* eslint-disable react/no-unused-state */

import { PropsBridgeContextProvider } from 'contexts';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Provider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      providedProps: {},
      onUpdateProps: this.onUpdateProps,
      onDeleteProps: this.onDeleteProps,
    };
  }

  onUpdateProps = (key, props) => {
    this.setState(({ providedProps }) => ({
      providedProps: {
        ...providedProps,
        [key]: { ...(providedProps[key] || {}), ...props },
      },
    }));
  };

  onDeleteProps = (key) => {
    this.setState(({ providedProps }) => ({ providedProps: { ...providedProps, [key]: null } }));
  };

  render() {
    const { children } = this.props;

    return <PropsBridgeContextProvider value={this.state}>{children}</PropsBridgeContextProvider>;
  }
}

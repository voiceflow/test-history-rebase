import React, { Component } from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

import { PropsBridgeContextConsumer } from 'contexts';

export default ({ id, key = 'providedProps', defaultProps = {} }) => Wrapper =>
  class WithPropsBridge extends Component {
    static displayName = wrapDisplayName(Wrapper, 'WithPropsBridge');

    render() {
      return (
        <PropsBridgeContextConsumer>
          {({ providedProps }) => (
            <Wrapper {...this.props} {...{ [key]: providedProps[id] || defaultProps }} />
          )}
        </PropsBridgeContextConsumer>
      );
    }
  };

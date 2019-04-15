import React, { Component } from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

import { track } from 'utils/tracker';

export default ({ didMount, willUnmount } = {}) => Wrapper =>
  class WithTracker extends Component {
    static displayName = wrapDisplayName(Wrapper, 'withTracker');

    componentDidMount() {
      if (didMount) {
        track(didMount.event || 'Page View', didMount.name, didMount.opts);
      }
    }

    componentWillUnmount() {
      if (willUnmount) {
        track(willUnmount.event || 'Page Leave', willUnmount.name, willUnmount.opts);
      }
    }

    render() {
      return <Wrapper {...this.props} />;
    }
  };

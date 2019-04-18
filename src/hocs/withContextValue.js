import React, { Component } from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

export default Consumer => Wrapper =>
  class WithContextValue extends Component {
    static displayName = wrapDisplayName(Wrapper, 'WithContextValue');

    render() {
      return <Consumer>{value => <Wrapper {...value} {...this.props} />}</Consumer>;
    }
  };

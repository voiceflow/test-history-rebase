import React from 'react';

class SwallowError extends React.PureComponent {
  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error: any) {
    if (!error) return;

    // eslint-disable-next-line no-console
    console.warn('error caught and swallowed', error);
  }

  render() {
    return this.props.children;
  }
}

export default SwallowError;

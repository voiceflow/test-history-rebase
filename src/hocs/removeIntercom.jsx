import React, { Component } from 'react';

const removeIntercom = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return class extends Component {
    componentDidMount() {
      this.style = document.createElement('STYLE');
      this.style.appendChild(document.createTextNode('#intercom-container {visibility: hidden;}'));
      document.head.appendChild(this.style);
    }

    componentWillUnmount() {
      if (this.style) document.head.removeChild(this.style);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

export default removeIntercom;

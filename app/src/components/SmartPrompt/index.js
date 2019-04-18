import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';

export default class SmartPrompt extends Component {
  static propTypes = {
    when: PropTypes.bool.isRequired,
    message: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  };

  static defaultProps = {
    message:
      'If you leave this page, all unsaved changes will be lost. Are you sure you want to leave this page?',
  };

  componentDidMount() {
    this.pathname = window.location.pathname;

    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  onBeforeUnload = e => {
    const { when, message } = this.props;
    const msg = typeof message === 'function' ? SmartPrompt.defaultProps.message : message;

    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if (when) {
      e.returnValue = msg;
    }
  };

  render() {
    const { when, message } = this.props;

    return (
      <Prompt
        when={when}
        message={
          typeof message === 'function'
            ? message
            : location => (location.pathname !== this.pathname ? message : true)
        }
      />
    );
  }
}

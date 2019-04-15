import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Input from 'components/Input';

export default class InputPassword extends Component {
  static propTypes = {
    actionText: PropTypes.string,
    onActionClick: PropTypes.func,
  };

  state = {
    passwordVisible: false,
  };

  onTogglePasswordVisibility = () => {
    const { onActionClick } = this.props;

    if (onActionClick) {
      onActionClick();
    } else {
      this.setState(({ passwordVisible }) => ({ passwordVisible: !passwordVisible }));
    }
  };

  render() {
    const { passwordVisible } = this.state;
    const { actionText, onActionClick, ...props } = this.props;

    return (
      <Input
        {...props}
        action={actionText ? null : passwordVisible ? 'eye-hidden' : 'eye'}
        formType={passwordVisible ? 'text' : 'password'}
        actionText={actionText}
        onActionClick={this.onTogglePasswordVisibility}
      />
    );
  }
}

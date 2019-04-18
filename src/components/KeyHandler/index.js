import React, { Component } from 'react';
import toLower from 'lodash/toLower';
import PropTypes from 'prop-types';
import ReactKeyHandler from 'react-key-handler';

export default class KeyHandler extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    trackName: PropTypes.string,
    trackOpts: PropTypes.object,
    trackEvent: PropTypes.string,
    onKeyHandle: PropTypes.func.isRequired,
    tagNamesBlacklist: PropTypes.arrayOf(PropTypes.string),
    classNamesBlacklist: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    trackEvent: 'Button Click',
  };

  onKeyHandle = e => {
    const { target } = e;
    const {
      disabled,
      onKeyHandle,
      tagNamesBlacklist,
      classNamesBlacklist,
    } = this.props;

    const tagName = toLower(target.tagName);
    const containsClass = target.classList.contains.bind(target.classList);

    if (disabled) {
      return;
    }

    if (tagNamesBlacklist && tagNamesBlacklist.includes(tagName)) {
      return;
    }

    if (classNamesBlacklist && classNamesBlacklist.some(containsClass)) {
      return;
    }

    onKeyHandle(e);
  };

  render() {
    return <ReactKeyHandler {...this.props} onKeyHandle={this.onKeyHandle} />;
  }
}

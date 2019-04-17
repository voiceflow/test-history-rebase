import React, { Component } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';

export default class Overlay extends Component {
  static propTypes = {
    onHide: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
    isFullscreen: PropTypes.bool,
    transitionClassNames: PropTypes.string,
  };

  onRef = node => {
    this.modalOverlay = node;
  };

  onRootClose = e => {
    const { onHide } = this.props;

    if (e.type === 'keyup') {
      requestAnimationFrame(() => !e._processed && onHide && onHide());
    }
  };

  render() {
    const { isPage, children, className, isFullscreen, transitionClassNames } = this.props;

    const style = {};

    // FIXME: Move to css
    if (isPage) {
      style.boxShadow = 'none';
      style.background = 'transparent';
    }

    return createPortal(
      <RootCloseWrapper onRootClose={this.onRootClose}>
        <div ref={this.onRef} className={cn(className, transitionClassNames)}>
          <div
            role="document"
            className={cn('modal-dialog', { 'a-transition__node': !isFullscreen })}
          >
            <div style={style} className="modal-content">
              {children}
            </div>
          </div>
        </div>
      </RootCloseWrapper>,
      document.querySelector('#root')
    );
  }
}

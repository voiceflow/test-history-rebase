import classNames from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { findScrollableParent, getCursorPosition, getNodePosition, getNodeSize } from '@/utils/dom';

import Overlay from './components/Overlay';

export default class Tooltip extends Component {
  static propTypes = {
    gap: PropTypes.number,
    text: PropTypes.any,
    delay: PropTypes.number,
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    display: PropTypes.string,
    TagName: PropTypes.string,
    strategy: PropTypes.string,
    stayOpen: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    buttonProps: PropTypes.object,
  };

  static defaultProps = {
    TagName: 'span',
    strategy: 'top',
    stayOpen: false,
  };

  state = {
    visible: false,
    strategy: this.props.strategy,
    scrollContainer: null,
  };

  showTimeout = null;

  componentDidMount() {
    this.setState({ scrollContainer: findScrollableParent(this.target) });
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps() {
    if (this.state.visible) {
      this.setState({ visible: false }, () => this.setState({ visible: true }));
    }
  }

  componentDidUpdate() {
    const { visible } = this.state;
    const { text, forceShow, buttonProps } = this.props;

    if (this.target && text && (forceShow || visible) && buttonProps && buttonProps.disabled) {
      window.document.addEventListener('mousemove', this.onMouseMove);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.showTimeout);

    window.document.removeEventListener('mousemove', this.onMouseMove);
  }

  onRef = (node) => {
    const { buttonProps } = this.props;
    this.target = node;

    if (buttonProps && buttonProps.ref) {
      buttonProps.ref(node);
    }
  };

  onMouseMove = ({ clientX, clientY }) => {
    const elementUnderMouse = document.elementFromPoint(clientX, clientY);

    if (this.target.contains(elementUnderMouse)) {
      return;
    }

    window.document.removeEventListener('mousemove', this.onMouseMove);
    this.onForceHide();
  };

  onShow = () => {
    const { delay, onShow, strategy } = this.props;

    if (delay) {
      this.showTimeout = setTimeout(() => {
        this.setState({ strategy, visible: true }, onShow);
      }, delay);
    } else {
      this.setState({ strategy, visible: true }, onShow);
    }
  };

  onForceHide = () => {
    const { onHide } = this.props;

    clearTimeout(this.showTimeout);

    this.setState({ visible: false }, onHide);
  };

  onChangeStrategy = (strategy) => this.setState({ strategy });

  onHide = (e) => {
    const { stayOpen } = this.props;

    if (!(stayOpen && this.hoverInsideTooltip(e))) {
      this.onForceHide();
    }
  };

  hoverInsideTooltip = (e) => {
    if (!this.tooltip || !e) {
      return false;
    }

    const point = getCursorPosition(e);
    const domNodeSize = getNodeSize(this.tooltip);
    const domNodePosition = getNodePosition(this.tooltip);
    let result = false;

    if (
      point[0] >= domNodePosition.left &&
      point[0] <= domNodePosition.left + domNodeSize.width &&
      point[1] >= domNodePosition.top &&
      point[1] <= domNodePosition.top + domNodeSize.height
    ) {
      result = true;
    }

    return result;
  };

  renderText = () => {
    const { text } = this.props;

    if (typeof text === 'function') {
      return text();
    }

    return text;
  };

  render() {
    const { gap, text, style, TagName, display, children, stayOpen, forceShow, className, buttonProps } = this.props;
    const { visible, strategy, scrollContainer } = this.state;

    const show = this.target && text && (forceShow || visible);
    const tooltipClassName = classNames('tooltip', { '__is-active': show });

    return (
      <TagName
        style={style || { display }}
        className={className}
        onMouseEnter={this.onShow}
        onMouseLeave={this.onHide}
        {...buttonProps}
        ref={this.onRef}
      >
        {children}

        {show && (
          <Overlay
            // eslint-disable-next-line no-nested-ternary
            gap={gap !== undefined ? gap : stayOpen ? 0 : undefined}
            role="tooltip"
            target={this.target}
            strategy={`${strategy}`}
            className={`${tooltipClassName}`}
            scrollContainer={scrollContainer}
            onChangeStrategy={this.onChangeStrategy}
          >
            {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
            <div
              ref={(r) => {
                this.tooltip = r;
              }}
              role="button"
              onClick={this.onForceHide}
              className="tooltip-inner"
              onMouseLeave={this.onHide}
            >
              {this.renderText()}
            </div>
          </Overlay>
        )}
      </TagName>
    );
  }
}

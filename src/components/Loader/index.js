import cn from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Loader extends Component {
  static propTypes = {
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    size: PropTypes.oneOf(['', 'sm', 'md']),
    style: PropTypes.object,
    inner: PropTypes.bool,
    inline: PropTypes.bool,
    timers: PropTypes.arrayOf(PropTypes.number),
    pending: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    transparent: PropTypes.bool,
    withoutIcon: PropTypes.bool,
    isFullscreen: PropTypes.bool,
  };

  static defaultProps = {
    children: null,
  };

  static getDerivedStateFromProps(props, state = {}) {
    if (props.pending !== state.propPending) {
      return {
        step: 0,
        propPending: props.pending,
      };
    }

    return null;
  }

  static isMultiple(texts) {
    return Array.isArray(texts) && texts.length > 1;
  }

  state = {
    step: 0,
  };

  componentDidMount() {
    const { pending } = this.props;

    if (pending) {
      this.startTimer();
    }
  }

  componentDidUpdate(prevProps) {
    const { pending } = this.props;

    if (pending && !prevProps.pending) {
      this.startTimer();
    } else if (!pending && prevProps.pending) {
      clearTimeout(this.timeout);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  startTimer() {
    const { step } = this.state;
    const { text, timers = [] } = this.props;

    if (!text || !Loader.isMultiple(text) || text.length === step + 1) {
      return;
    }

    this.timeout = setTimeout(() => {
      this.setState({ step: step + 1 });
      this.startTimer();
    }, timers[step]);
  }

  render() {
    const { step } = this.state;
    const { text = '', size, inner, inline, pending, children, transparent, withoutIcon, isFullscreen } = this.props;

    const style = this.props.style || {};
    const isMultiple = Loader.isMultiple(text);

    // FIXME: Move to css
    if (isFullscreen) {
      style.position = 'fixed';
      style.backgroundColor = '#f6f6f6';
    }

    // eslint-disable-next-line no-nested-ternary
    return pending ? (
      <div
        style={style}
        className={cn({
          __transparent: transparent,
          'sl-loader-outer': !inline && !inner,
          'sl-loader-inner': !inline && inner,
        })}
      >
        {isMultiple && (
          <div className="sl-loader-counter">
            <strong>{step + 1}</strong> <span className="text-gray">of {text.length}</span>
          </div>
        )}

        {!withoutIcon && <i className={`sl-loader __size-${size}`} />}

        {text && <div className="sl-loader-text">{isMultiple ? text[step] : text}</div>}
      </div>
    ) : typeof children === 'function' ? (
      children()
    ) : (
      children
    );
  }
}

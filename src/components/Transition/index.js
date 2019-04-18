import React, { Component } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

const nameTypes = [
  'fade',
  'none',
  'fade-up',
  'fade-down',
  'fade-left',
  'fade-small',
  'fade-right',
  'fade-sidebar',
  'fade-up-small',
  'fade-scale-y',
  'fade-down-small',
];

export default class Transition extends Component {
  static propTypes = {
    in: PropTypes.bool,
    name: PropTypes.oneOf(nameTypes),
    node: PropTypes.bool,
    exit: PropTypes.bool,
    style: PropTypes.object,
    delay: PropTypes.number,
    enter: PropTypes.bool,
    appear: PropTypes.bool,
    timeout: PropTypes.number,
    nameExit: PropTypes.oneOf(nameTypes),
    nameEnter: PropTypes.oneOf(nameTypes),
    component: PropTypes.any,
    className: PropTypes.string,
    mountOnIn: PropTypes.bool,
    defaultEnter: PropTypes.bool,
    wrapperProps: PropTypes.object,
    forceAnimate: PropTypes.bool,
  };

  static defaultProps = {
    in: true,
    node: true,
    exit: true,
    delay: 0,
    style: {},
    enter: true,
    appear: true,
    timeout: 180,
    component: 'div',
    mountOnIn: false,
    defaultEnter: true,
    forceAnimate: false,
    wrapperProps: {},
  };

  static getDerivedStateFromProps(props, state) {
    if (!state && !props.delay && !props.mountOnIn) {
      return {
        in: props.in,
      };
    }

    if (!props.forceAnimate && props.in && !state.in && !props.delay && !props.mountOnIn) {
      return {
        in: true,
      };
    }

    if ((!props.exit && !props.in) || (!props.in && state.in)) {
      return {
        in: false,
      };
    }

    return null;
  }

  state = {
    in: false,
  };

  componentDidMount() {
    const { in: _in, delay, mountOnIn } = this.props;

    if (_in && (delay || mountOnIn)) {
      this.animationFrame = requestAnimationFrame(() => {
        this.setState({ in: true });
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { in: _in, delay, mountOnIn, forceAnimate } = this.props;

    if (forceAnimate && !prevProps.forceAnimate) {
      this.forceAnimate();
    }

    if (_in && !this.state.in && (delay || mountOnIn)) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = requestAnimationFrame(() => {
        this.setState({ in: true });
      });
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrame);
  }

  forceAnimate() {
    this.setState({ in: false }, () => this.setState({ in: true }));
  }

  render() {
    const { in: _in } = this.state;

    const {
      name,
      exit,
      node,
      delay,
      style,
      enter,
      appear,
      timeout,
      children,
      nameExit,
      nameEnter,
      component: WComponent,
      className,
      mountOnIn,
      defaultEnter,
      wrapperProps,
      forceAnimate,
      ...transitionProps
    } = this.props;

    let _style = {};

    let _name = name;

    if (delay) {
      _style = {
        ...style,
        WebkitTransitionDelay: `${delay}ms`,
        transitionDelay: `${delay}ms`,
      };
    }

    if (_in && nameEnter) {
      _name = nameEnter;
    } else if (!_in && nameExit) {
      _name = nameExit;
    }

    return (
      (!mountOnIn || this.props.in) && (
        <CSSTransition
          {...transitionProps}
          in={_in}
          exit={forceAnimate ? false : exit}
          enter={forceAnimate ? true : enter}
          appear={forceAnimate ? false : appear}
          timeout={_in ? timeout + delay : timeout}
          classNames="a-transition"
        >
          <WComponent
            {...wrapperProps}
            style={_style}
            className={cn(className, `--${_name}`, {
              'a-transition__node': node,
              'a-transition-enter': !_in && defaultEnter,
            })}
          >
            {children}
          </WComponent>
        </CSSTransition>
      )
    );
  }
}

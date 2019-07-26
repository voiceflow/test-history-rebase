/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Selectable extends Component {
  static propTypes = {
    value: PropTypes.any,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    opened: PropTypes.bool,
    onSelect: PropTypes.func,
    children: PropTypes.func.isRequired,
    stopPropagation: PropTypes.bool,
    popoverRenderer: PropTypes.func.isRequired,
  };

  static defaultProps = {
    opened: false,
  };

  static getDerivedStateFromProps(props, state = {}) {
    if (!state || props.opened !== state.propOpened) {
      return {
        opened: props.opened,
        propOpened: props.opened,
      };
    }

    return null;
  }

  state = {
    opened: this.props.opened,
  };

  target = null;

  componentWillUnmount() {
    this.__unmounted = true;
  }

  onRef = (node) => {
    this.target = node;
  };

  onHide = () => {
    const { onHide } = this.props;
    const { opened } = this.state;

    opened && onHide && onHide();

    !this.__unmounted && this.setState({ opened: false });
  };

  onShow = (e) => {
    const { opened } = this.state;
    const { onShow, stopPropagation } = this.props;

    if (stopPropagation && e && e.stopPropagation) {
      e.stopPropagation();
    }

    !opened && onShow && onShow(e);

    !this.__unmounted && this.setState({ opened: true });
  };

  onSelect = (value) => {
    const { onHide, onSelect } = this.props;

    onHide && onHide();
    onSelect && onSelect(value);

    !this.__unmounted && this.setState({ opened: false });
  };

  render() {
    const { opened } = this.state;
    const { value, onHide, opened: defaultOpened, onShow, onSelect, children, stopPropagation, popoverRenderer, ...popoverProps } = this.props;

    return (
      <>
        {popoverRenderer({
          ...popoverProps,
          show: opened,
          value,
          target: this.target,
          onHide: this.onHide,
          onSelect: this.onSelect,
        })}

        {children({
          show: this.onShow,
          hide: this.onHide,
          onRef: this.onRef,
          value,
          opened,
        })}
      </>
    );
  }
}

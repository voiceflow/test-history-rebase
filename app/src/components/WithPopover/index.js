import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import Popover from '../Popover';

export default class WithPopover extends Component {
  static propTypes = {
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    opened: PropTypes.bool,
    target: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
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

  onRef = node => {
    this.target = node;
  };

  onHide = () => {
    const { onHide } = this.props;

    onHide && onHide();
    this.setState({ opened: false });
  };

  onShow = () => {
    const { onShow } = this.props;

    onShow && onShow();

    this.setState({ opened: true });
  };

  render() {
    const { opened } = this.state;
    const { target, children, opened: defaultOpened, ...popoverProps } = this.props;

    return (
      <Fragment>
        <Popover
          isText
          strategy="top left"
          setMinWidth
          {...popoverProps}
          show={opened}
          target={this.target}
          onHide={this.onHide}
          renderBody={() => children({ hide: this.onHide })}
        />

        {target({ show: this.onShow, hide: this.onHide, onRef: this.onRef, opened })}
      </Fragment>
    );
  }
}

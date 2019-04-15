import { Component } from 'react';
import PropTypes from 'prop-types';

export default class Collapsible extends Component {
  static propTypes = {
    opened: PropTypes.bool,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    children: PropTypes.func.isRequired,
    forceOpened: PropTypes.bool,
  };

  static defaultProps = {
    opened: false,
    forceOpened: false,
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

  onToggleOpened = () => {
    const { opened } = this.state;
    const { onHide, onShow } = this.props;

    opened && onHide && onHide();
    !opened && onShow && onShow();

    this.setState({ opened: !opened });
  };

  render() {
    const { opened } = this.state;
    const { children, forceOpened } = this.props;

    return children({
      opened: forceOpened || opened,
      onToggleOpened: this.onToggleOpened,
    });
  }
}

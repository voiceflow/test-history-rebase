import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { PropsBridgeContextConsumer } from 'contexts';

class Updater extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onUpdateProps: PropTypes.func,
    onDeleteProps: PropTypes.func,
  };

  componentDidMount() {
    const { id, onUpdateProps, onDeleteProps, ...data } = this.props;

    onUpdateProps && onUpdateProps(id, data);
  }

  componentDidUpdate() {
    const { id, onUpdateProps, onDeleteProps, ...data } = this.props;

    onUpdateProps && onUpdateProps(id, data);
  }

  componentWillUnmount() {
    const { id, onDeleteProps } = this.props;

    onDeleteProps && onDeleteProps(id);
  }

  render() {
    return null;
  }
}

export default function PropBridgeUpdater(props) {
  return (
    <PropsBridgeContextConsumer>
      {({ onUpdateProps, onDeleteProps }) => (
        <Updater {...props} onUpdateProps={onUpdateProps} onDeleteProps={onDeleteProps} />
      )}
    </PropsBridgeContextConsumer>
  );
}

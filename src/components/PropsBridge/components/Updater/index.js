// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { PropsBridgeContextConsumer } from '@/contexts';

class Updater extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onUpdateProps: PropTypes.func,
    onDeleteProps: PropTypes.func,
  };

  componentDidMount() {
    this.onUpdateProps();
  }

  componentDidUpdate() {
    this.onUpdateProps();
  }

  componentWillUnmount() {
    const { id, onDeleteProps } = this.props;

    onDeleteProps && onDeleteProps(id);
  }

  onUpdateProps() {
    const { id, onUpdateProps, onDeleteProps, ...data } = this.props;

    onUpdateProps && onUpdateProps(id, data);
  }

  // eslint-disable-next-line lodash/prefer-constant
  render() {
    return null;
  }
}

export default function PropBridgeUpdater(props) {
  return (
    <PropsBridgeContextConsumer>
      {({ onUpdateProps, onDeleteProps }) => <Updater {...props} onUpdateProps={onUpdateProps} onDeleteProps={onDeleteProps} />}
    </PropsBridgeContextConsumer>
  );
}

import React from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

import withFileLoader from 'hocs/withFileLoader';

function FileDropWrapper({ style, children, className, connectDropTarget, ...props }) {
  return (
    connectDropTarget &&
    connectDropTarget(
      <div style={style} className={className}>
        {children(props)}
      </div>
    )
  );
}

FileDropWrapper.propTypes = {
  style: PropTypes.object,
  children: PropTypes.func.isRequired,
  className: PropTypes.string,
  connectDropTarget: PropTypes.func,
};

const target = {
  drop(props, monitor) {
    const [file] = monitor.getItem().files;

    if (props.onProcessFile && file.type.match(props.accept.replace(/,/g, '|'))) {
      props.onProcessFile(file);
    }
  },
  canDrop(props) {
    return !props.disabled;
  },
};

export default compose(
  withFileLoader(),
  DropTarget(NativeTypes.FILE, target, (connect, monitor) => ({
    canDrop: monitor.canDrop(),
    connectDropTarget: connect.dropTarget(),
  }))
)(FileDropWrapper);

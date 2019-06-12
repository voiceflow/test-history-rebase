/* eslint-disable no-unused-expressions */
import throttle from 'lodash/throttle';
import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { findDOMNode } from 'react-dom';
import compose from 'recompose/compose';
import wrapDisplayName from 'recompose/wrapDisplayName';

export default ({ name, styles = {}, canDrag, canDrop, onDropKey, onMoveKey, allowXTransform = false, allowYTransform = true }) => (Wrapper) => {
  class WithDraggable extends Component {
    static displayName = wrapDisplayName(Wrapper, 'WithDraggable');

    componentDidMount() {
      const { connectDragPreview } = this.props;

      connectDragPreview && connectDragPreview(getEmptyImage(), { captureDraggingState: true });
    }

    render() {
      return <Wrapper {...this.props} />;
    }
  }

  const panelSource = {
    canDrag,
    endDrag(props, monitor) {
      const item = monitor.getItem();
      const { [onDropKey]: onDrop, onToggleDragging } = props;

      // eslint-disable-next-line no-underscore-dangle
      onDrop && onDrop({ toListId: item.listId, fromListId: item._initialListId });
      onToggleDragging && onToggleDragging(false);
    },
    beginDrag(props, _, component) {
      const { onToggleDragging } = props;
      // eslint-disable-next-line react/no-find-dom-node
      const { clientWidth, clientHeight } = findDOMNode(component);

      onToggleDragging && onToggleDragging(true);

      return {
        ...props,
        _width: clientWidth,
        _height: clientHeight,
        _styles: styles,
        dragType: name,
        _initialListId: props.listId,
        _allowXTransform: allowXTransform,
        _allowYTransform: allowYTransform,
        isDraggingPreview: true,
      };
    },
    isDragging(props, monitor) {
      return !props.isFB && props.id === monitor.getItem().id;
    },
  };

  const panelTarget = {
    hover: throttle((props, monitor, component) => {
      const dragItem = monitor.getItem();

      if (!component || !dragItem || (canDrop && !canDrop(props))) {
        return null;
      }

      const { id: dragId } = dragItem;
      const { index: hoverIndex, id: hoverId } = props;

      if (dragId === hoverId) {
        return;
      }

      props[onMoveKey] && props[onMoveKey](dragItem, props);

      const item = monitor.getItem();

      item.index = hoverIndex;
      item.listId = props.listId;
    }, 150),
  };

  return compose(
    DropTarget(name, panelTarget, (connect) => ({
      connectDropTarget: connect.dropTarget(),
    })),
    DragSource(name, panelSource, (connect, monitor) => ({
      isDragging: monitor.isDragging(),
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
    }))
  )(WithDraggable);
};

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import compose from 'recompose/compose';
import _ from 'lodash';
import wrapDisplayName from 'recompose/wrapDisplayName';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { DragSource, DropTarget } from 'react-dnd';

export default ({
  name,
  styles = {},
  canDrag,
  canDrop,
  onDropKey,
  onMoveKey,
  allowXTransform = false,
  allowYTransform = true,
}) => Wrapper => {
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

      onDrop && onDrop({ toListId: item.listId, fromListId: item._initialListId });
      onToggleDragging && onToggleDragging(false);
    },
    beginDrag(props, _, component) {
      const { onToggleDragging } = props;
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
    hover(props, monitor, component) {
      const dragItem = monitor.getItem();
      if (!component) {
        return null;
      }

      const {
        index: dragIndex,
        project_id: dragId
      } = dragItem;
      const {
        index: hoverIndex,
        project_id: hoverId
      } = props;

      if (dragIndex === hoverIndex) {
        return;
      }

        const item = monitor.getItem();
        item.index = hoverIndex;
        item.listId = props.listId;
        _.isNumber(hoverIndex) && _.isNumber(dragIndex) && props.reorder && props.reorder(dragIndex, hoverIndex, dragId, hoverId);
    },
  };

  return compose(
    DropTarget(name, panelTarget, connect => ({
      connectDropTarget: connect.dropTarget(),
    })),
    DragSource(name, panelSource, (connect, monitor) => ({
      isDragging: monitor.isDragging(),
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
    }))
  )(WithDraggable);
};

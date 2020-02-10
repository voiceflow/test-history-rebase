import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { HOVER_THROTTLE_TIMEOUT } from './constants';

const useDragAndDrop = (type, handlers, partialDrag, props) => {
  const rootRef = React.useRef(null);
  const dragRef = React.useRef(null);

  const [, connectDrop] = useDrop({
    drop: (...args) => handlers.current.onDrop?.(...args),
    accept: type,
    hover: _throttle((item, monitor) => {
      item.deleteHovered = false;

      if (!rootRef.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = props.index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const { top, bottom } = rootRef.current.getBoundingClientRect();
      const hoverMiddleY = (bottom - top) / 2;
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      const hoverClientY = clientOffset.y - top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      handlers.current.onReorder?.(dragIndex, hoverIndex);

      item.index = hoverIndex;
    }, HOVER_THROTTLE_TIMEOUT),
  });

  const [{ isDragging }, connectDrag, connectPreview] = useDrag({
    item: {
      ...props,
      type,
      getStyle: () => ({
        width: rootRef.current?.clientWidth,
        height: rootRef.current?.clientHeight,
      }),
    },
    end: (...args) => handlers.current.onDragEnd?.(...args),
    begin: (...args) => handlers.current.onDragStart?.(...args),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  React.useEffect(() => {
    connectPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const connectedRootRef = partialDrag ? connectDrop(rootRef) : connectDrag(connectDrop(rootRef));
  const connectedDragRef = partialDrag ? connectDrag(dragRef) : null;

  return [isDragging, connectedRootRef, connectedDragRef];
};

export default useDragAndDrop;

import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

// eslint-disable-next-line import/prefer-default-export
export const useReorderable = (type, index, { reorder, canDrag, canDrop, ...handlers }, props) => {
  const rootRef = React.useRef(null);

  const [, connectDrop] = useDrop({
    accept: type,
    canDrop,
    hover(item, monitor) {
      if (!rootRef.current || !monitor.canDrop()) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = rootRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      if (reorder(dragIndex, hoverIndex)) {
        item.index = hoverIndex;
      }
    },
    drop: () => ({ reorder: true }),
  });

  const [{ isDragging }, connectDrag, connectPreview] = useDrag({
    item: {
      ...props,
      type,
      index,
      getRect: () => rootRef.current.getBoundingClientRect(),
    },
    canDrag,
    begin: () => handlers.startDrag?.(),
    end: (_, monitor) => {
      const result = monitor.getDropResult();
      if (!result || result.reorder) {
        handlers.endDrag?.();
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  React.useEffect(() => {
    connectPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const connectTarget = connectDrag(connectDrop(rootRef));

  return [isDragging, connectTarget];
};

import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { HOVER_THROTTLE_TIMEOUT } from './constants';
import { Handlers, InternalItem } from './types';

const useDragAndDrop = <I extends { id: string }>(
  type: string,
  handlers: { current: Handlers },
  props: InternalItem<I>,
  { partialDrag, unmountableDuringDrag }: { partialDrag?: boolean; unmountableDuringDrag?: boolean }
): [boolean, React.ReactElement | null, React.ReactElement | null] => {
  const rootRef = React.useRef<HTMLElement>(null);
  const dragRef = React.useRef<HTMLElement>(null);
  const cacheRef = React.useRef<{ id: string; styles: { width?: number; height?: number } }>({ id: props.item.id, styles: {} });

  cacheRef.current.id = props.item.id ?? props.item;

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
      getStyle: () => {
        if (!unmountableDuringDrag || !(cacheRef.current.styles.width && cacheRef.current.styles.height)) {
          cacheRef.current.styles = {
            width: rootRef.current?.clientWidth,
            height: rootRef.current?.clientHeight,
          };
        }

        return cacheRef.current.styles;
      },
    },
    end: (...args) => handlers.current.onDragEnd?.(...args),
    begin: (...args) => handlers.current.onDragStart?.(...args),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    isDragging: unmountableDuringDrag ? (monitor) => cacheRef.current.id === (monitor.getItem().item.id ?? monitor.getItem().item) : undefined,
  });

  React.useEffect(() => {
    connectPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const connectedRootRef = partialDrag ? connectDrop(rootRef) : connectDrag(connectDrop(rootRef));
  const connectedDragRef = partialDrag ? connectDrag(dragRef) : null;

  return [isDragging, connectedRootRef, connectedDragRef];
};

export default useDragAndDrop;

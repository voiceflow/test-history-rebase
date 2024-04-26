import { usePersistFunction } from '@voiceflow/ui';
import _throttle from 'lodash/throttle';
import React from 'react';
import type { DropTargetMonitor } from 'react-dnd';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { HOVER_THROTTLE_TIMEOUT } from '@/constants';
import type { DragContextPreviewProps } from '@/contexts/DragContext';

import type { DnDHandlers, DnDItem, InternalItem } from './types';

interface CollectedProps {
  isDragging: boolean;
  isDraggingXEnabled: boolean;
}

interface Options<I> {
  getItemKey: (item: I) => string;
  partialDrag?: boolean;
  unmountableDuringDrag?: boolean;
  disableReorderingWhileDraggingX?: boolean;
}

const dragItemsMap = new Map<string, (value: boolean) => void>();

const useDragAndDrop = <I extends { id: string } | any>(
  type: string,
  handlers: { current: DnDHandlers<I> },
  props: Omit<InternalItem<I>, 'type'>,
  { getItemKey, partialDrag, unmountableDuringDrag, disableReorderingWhileDraggingX }: Options<I>
): [CollectedProps, React.RefObject<HTMLElement>, React.RefObject<HTMLElement>] => {
  const rootRef = React.useRef<HTMLElement>(null);
  const dragRef = React.useRef<HTMLElement>(null);
  const [isDraggingXEnabled, setIsDraggingXEnabled] = React.useState(false);
  const cacheRef = React.useRef<{ key: string; styles: { width?: number; height?: number } }>({ key: '', styles: {} });

  cacheRef.current.key = getItemKey(props.item);

  const [, connectDrop] = useDrop<DnDItem<I>, void, void>({
    drop: (item, monitor) => handlers.current.onDrop?.(item, monitor),
    canDrop: handlers.current.canDrop,
    accept: type,
    hover: _throttle((item: DnDItem<I>, monitor: DropTargetMonitor) => {
      item.deleteHovered = false;

      if (
        !rootRef.current ||
        !handlers.current.onReorder ||
        (disableReorderingWhileDraggingX && item.isDraggingXEnabled)
      ) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = props.index;

      if (dragIndex === hoverIndex) return;
      if (handlers.current.canReorder && !handlers.current.canReorder(dragIndex, hoverIndex)) return;

      const { top, bottom } = rootRef.current.getBoundingClientRect();
      const hoverMiddleY = (bottom - top) / 2;
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      handlers.current.onReorder(dragIndex, hoverIndex);

      item.index = hoverIndex;
    }, HOVER_THROTTLE_TIMEOUT),
  });

  const persistedSetIsDraggingXEnabled = usePersistFunction((value: boolean) =>
    dragItemsMap.get(cacheRef.current.key)?.(value)
  );

  const dragItem = {
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
    setIsDraggingXEnabled: persistedSetIsDraggingXEnabled,
  };

  const [{ isDragging }, connectDrag, connectPreview] = useDrag<
    DnDItem<I> & { getStyle: DragContextPreviewProps['getStyle']; setIsDraggingXEnabled: (value: boolean) => void },
    void,
    { isDragging: boolean }
  >({
    type,

    end: (_result, monitor) => {
      // reset width and height when ends the drag.
      // That way we get the current width and height when we start a new drag.
      // This is important to support resizes.
      cacheRef.current.styles.width = undefined;
      cacheRef.current.styles.height = undefined;
      handlers.current.onDragEnd?.(props.item as I, monitor);
    },

    item: (monitor) => {
      handlers.current.onDragStart?.(props.item as I, monitor);

      return dragItem;
    },

    collect: (monitor) => ({ isDragging: monitor.isDragging() }),

    canDrag:
      typeof handlers.current.canDrag === 'function'
        ? (monitor) => (handlers.current.canDrag as Function)(dragItem, monitor)
        : handlers.current.canDrag,

    isDragging: unmountableDuringDrag
      ? (monitor) => {
          const item = monitor.getItem();

          return cacheRef.current.key === getItemKey(item.item);
        }
      : undefined,
  });

  // since the items can be unmounted, we should somehow map the preview with the remounted item
  React.useEffect(() => {
    dragItemsMap.set(cacheRef.current.key, setIsDraggingXEnabled);

    return () => {
      dragItemsMap.delete(cacheRef.current.key);
    };
  }, [cacheRef.current.key]);

  React.useEffect(() => {
    connectPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  connectDrop(rootRef);

  if (partialDrag) {
    connectDrag(dragRef);
  } else {
    connectDrag(rootRef);
  }

  return [{ isDragging, isDraggingXEnabled }, rootRef as any, (partialDrag ? dragRef : null) as any];
};

export default useDragAndDrop;

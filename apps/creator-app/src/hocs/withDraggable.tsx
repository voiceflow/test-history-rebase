import type { EmptyObject } from '@voiceflow/common';
import _constant from 'lodash/constant';
import _throttle from 'lodash/throttle';
import React from 'react';
import type { DragSourceMonitor } from 'react-dnd';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

export interface InjectedDraggableProps {
  isDragging?: boolean;
  disableDragging?: boolean;
  connectedRootRef: React.RefObject<HTMLDivElement>;
  isDraggingPreview?: boolean;
}

export interface DropOptions {
  toListID?: string;
  fromListID?: string;
}

export interface ExposedProps<Props extends EmptyObject> {
  id: string;
  isFB?: boolean;
  index: number;
  listID?: string;
  onDrop?: (item: DragItem<Props>, dropOptions: DropOptions) => void;
  onMove?: (item: DragItem<Props>, hoverItem: DragItem<Props>) => void;
  onDragStart?: (item: DragItem<Props>) => void;
  disableDragging?: boolean;
}

export type DragItem<Props extends EmptyObject> = ExposedProps<Props> & Props & { _initialListID?: string };

export interface DraggableOptions<Props extends EmptyObject> {
  name: string;
  styles?: React.CSSProperties;
  canDrag?: boolean | ((monitor: DragSourceMonitor<ExposedProps<Props>>, props: ExposedProps<Props>) => boolean);
  canDrop?: (props: ExposedProps<Props>) => boolean;
  dropOnly?: boolean;
  allowXTransform?: boolean;
  allowYTransform?: boolean;
}

export const withDraggable =
  <P extends EmptyObject>({
    name,
    styles = {},
    canDrag,
    canDrop = _constant(true),
    dropOnly,
    allowXTransform = false,
    allowYTransform = true,
  }: DraggableOptions<P>) =>
  (Wrapper: React.FC<P & InjectedDraggableProps>) => {
    type Props = P & ExposedProps<P>;

    return (props: Omit<Props, Exclude<keyof InjectedDraggableProps, 'disableDragging'>>) => {
      const rootRef = React.useRef<HTMLDivElement>(null);

      const [, connectDrop] = useDrop<DragItem<Props>>({
        accept: name,

        hover: _throttle((item: DragItem<Props>) => {
          if (!item || (canDrop && !canDrop(props))) return;

          const { id: dragId } = item;
          const { index: hoverIndex, id: hoverId } = props;

          if (dragId === hoverId) return;

          props.onMove?.(item, props as DragItem<Props>);

          // eslint-disable-next-line no-param-reassign
          item.index = hoverIndex;
          // eslint-disable-next-line no-param-reassign
          item.listID = props.listID;
        }, 150),
      });

      const [{ isDragging }, connectDrag, connectPreview] = useDrag<Props, unknown, { isDragging: boolean }>({
        type: name,

        canDrag: typeof canDrag === 'function' ? (monitor) => canDrag(monitor, props) : canDrag,

        item: () => {
          const item = {
            ...props,
            _width: rootRef.current?.clientWidth,
            _height: rootRef.current?.clientHeight,
            _styles: styles,
            dragType: name,
            _initialListID: props.listID,
            _allowXTransform: allowXTransform,
            _allowYTransform: allowYTransform,
            isDraggingPreview: true,
          } as DragItem<Props>;

          props.onDragStart?.(item);

          return item;
        },

        end: (props, monitor) => {
          const item = monitor.getItem<DragItem<Props>>();

          props.onDrop?.(props, { toListID: item.listID, fromListID: item._initialListID });
        },

        collect: (monitor) => ({ isDragging: monitor.isDragging() }),

        isDragging: (monitor) => !props.isFB && props.id === monitor.getItem().id,
      });

      React.useEffect(() => {
        connectPreview(getEmptyImage(), { captureDraggingState: true });
      }, []);

      connectDrop(rootRef);

      if (!dropOnly) {
        connectDrag(rootRef);
      }

      return <Wrapper {...(props as P)} isDragging={isDragging} connectedRootRef={rootRef} />;
    };
  };

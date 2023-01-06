import _constant from 'lodash/constant';
import _throttle from 'lodash/throttle';
import React from 'react';
import { DragSourceHookSpec, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

export interface InjectedDraggableComponentProps {
  connectedRootRef: React.RefObject<HTMLDivElement>;
}

export interface DropOptions {
  toListId: string;
  fromListId: string;
}

type DynamicDropProps<D extends string> = Partial<Record<D, (dropOptions: DropOptions) => void>>;
type DynamicMoveProps<D extends string, M extends string> = Partial<
  Record<M, (dragItem: DragItem<D, M>, props: ExposedDraggableComponentProps<D, M>) => void>
>;

export type ExposedDraggableComponentProps<D extends string, M extends string> = DynamicDropProps<D> &
  DynamicMoveProps<D, M> & {
    id: number | string;
    index: number;
    listId?: string;
    isFB?: boolean;
    disableDragging?: boolean;
    onToggleDragging?: (isDragging: boolean) => void;
  };

export type DragItem<D extends string = string, M extends string = string> = ExposedDraggableComponentProps<D, M> & {
  _initialListId: string;
};

export type HoverItem<D extends string = string, M extends string = string> = ExposedDraggableComponentProps<D, M>;

export interface DraggableOptions<D extends string, M extends string> {
  name: string;
  styles?: React.CSSProperties;
  onDropKey: D;
  onMoveKey: M;
  canDrag?: DragSourceHookSpec<ExposedDraggableComponentProps<D, M>, {}, {}>['canDrag'];
  canDrop?: (props: ExposedDraggableComponentProps<D, M>) => boolean;
  dropOnly?: boolean;
  allowXTransform?: boolean;
  allowYTransform?: boolean;
}

export const withDraggable =
  <D extends string, M extends string>({
    name,
    styles = {},
    canDrag,
    canDrop = _constant(true),
    onDropKey,
    onMoveKey,
    dropOnly,
    allowXTransform = false,
    allowYTransform = true,
  }: DraggableOptions<D, M>) =>
  <P extends object>(Wrapper: React.FC<P>) => {
    type Props = ExposedDraggableComponentProps<D, M>;

    return (props: Omit<P, keyof InjectedDraggableComponentProps> & Props) => {
      const rootRef = React.useRef<HTMLElement>(null);

      const [, connectDrop] = useDrop<DragItem<D, M>>({
        accept: name,

        hover: _throttle((item: DragItem<D, M>) => {
          if (!item || (canDrop && !canDrop(props))) return;

          const { id: dragId } = item;
          const { index: hoverIndex, id: hoverId } = props;

          if (dragId === hoverId) return;

          props[onMoveKey]?.(item, props);

          item.index = hoverIndex;
          item.listId = props.listId;
        }, 150),
      });

      const [{ isDragging }, connectDrag, connectPreview] = useDrag<Props, unknown, { isDragging: boolean }>({
        type: name,

        canDrag,

        item: () => {
          const { onToggleDragging } = props;

          onToggleDragging?.(true);

          return {
            ...props,
            _width: rootRef.current?.clientWidth,
            _height: rootRef.current?.clientHeight,
            _styles: styles,
            dragType: name,
            _initialListId: props.listId,
            _allowXTransform: allowXTransform,
            _allowYTransform: allowYTransform,
            isDraggingPreview: true,
          };
        },

        end: (props, monitor) => {
          const item = monitor.getItem<DragItem>();
          const { [onDropKey]: onDrop, onToggleDragging } = props;

          onDrop?.({ toListId: item.listId!, fromListId: item._initialListId, ...props });
          onToggleDragging?.(false);
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

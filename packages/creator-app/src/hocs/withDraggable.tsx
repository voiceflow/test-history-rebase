import _constant from 'lodash/constant';
import _throttle from 'lodash/throttle';
import React from 'react';
import {
  ConnectDragPreview,
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DragSourceSpec,
  DropTarget,
  DropTargetMonitor,
  DropTargetSpec,
} from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { findDOMNode } from 'react-dom';
import compose from 'recompose/compose';
import wrapDisplayName from 'recompose/wrapDisplayName';

export interface InjectedDraggableComponentProps {
  connectDropTarget: ConnectDropTarget | null;
  connectDragSource: ConnectDragSource | null;
  connectDragPreview: ConnectDragPreview | null;
}

export interface DropOptions {
  toListId: string;
  fromListId: string;
}

type DynamicDropProps<D extends string> = Partial<Record<D, (dropOptions: DropOptions) => void>>;
type DynamicMoveProps<D extends string, M extends string> = Partial<Record<M, (dragItem: DragItem<D, M>, props: DragItem<D, M>) => void>>;

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
  canDrag?: DragSourceSpec<ExposedDraggableComponentProps<D, M>, {}>['canDrag'];
  canDrop?: (props: ExposedDraggableComponentProps<D, M>) => boolean;
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
    allowXTransform = false,
    allowYTransform = true,
  }: DraggableOptions<D, M>) =>
  <P extends object>(Wrapper: React.FC<P>) => {
    type Props = ExposedDraggableComponentProps<D, M>;

    class WithDraggable extends React.Component<P & Props & InjectedDraggableComponentProps> {
      static displayName = wrapDisplayName(Wrapper, 'WithDraggable');

      componentDidMount() {
        const { connectDragPreview } = this.props;

        connectDragPreview?.(getEmptyImage(), { captureDraggingState: true });
      }

      render() {
        return <Wrapper {...this.props} />;
      }
    }

    const panelSource: DragSourceSpec<Props, {}> = {
      canDrag,
      endDrag(props, monitor) {
        const item = monitor.getItem() as DragItem;
        const { [onDropKey]: onDrop, onToggleDragging } = props;

        onDrop?.({ toListId: item.listId!, fromListId: item._initialListId, ...props });
        onToggleDragging?.(false);
      },
      beginDrag(props, _, component) {
        const { onToggleDragging } = props;
        // eslint-disable-next-line react/no-find-dom-node
        const { clientWidth, clientHeight } = findDOMNode(component) as Element;

        onToggleDragging?.(true);

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
      isDragging: (props, monitor) => !props.isFB && props.id === monitor.getItem().id,
    };

    const panelTarget: DropTargetSpec<Props> = {
      hover: _throttle((props: Props, monitor: DropTargetMonitor, component: any) => {
        const dragItem = monitor.getItem() as DragItem;

        if (!component || !dragItem || (canDrop && !canDrop(props))) return;

        const { id: dragId } = dragItem;
        const { index: hoverIndex, id: hoverId } = props;

        if (dragId === hoverId) return;

        props[onMoveKey]?.(dragItem, props as DragItem<D, M>);

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
    )(WithDraggable as any) as React.ComponentType<Omit<P, keyof InjectedDraggableComponentProps> & Props>;
  };

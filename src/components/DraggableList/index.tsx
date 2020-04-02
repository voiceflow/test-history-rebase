import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrop } from 'react-dnd';

import { MapManaged, MenuOption } from '@/types';

import { DeleteComponent, DnDItem, DragPreview, DropDelete, ListContainer } from './components';
import { HOVER_THROTTLE_TIMEOUT } from './constants';
import { Handlers, InternalItem } from './types';

export { DeleteComponent };

type RenderItem<I extends unknown> = (data: Omit<InternalItem<I>, 'type'>) => React.ReactNode;

export type DraggableListProps<I> = {
  type: string;
  filter?: (item: I) => boolean;
  footer?: React.ReactNode;
  onDrop?: (item: InternalItem<I>) => unknown;
  onDelete?: (key: string | number, item: InternalItem<I>) => void;
  itemProps?: any;
  onEndDrag?: (...args: any[]) => unknown;
  onReorder?: (dragIndex: number, hoverIndex: number) => void;
  getItemKey?: (item: I) => string;
  onStartDrag?: (...args: any[]) => void;
  deleteProps?: Record<string, any>;
  itemComponent: React.FC<any>;
  previewOptions?: Record<string, any>;
  deleteComponent: React.FC<any>;
  partialDragItem?: boolean;
  previewComponent: React.FC<any>;
  contextMenuOptions?: MenuOption[];
  unmountableDuringDrag?: boolean;
  withContextMenuDelete?: boolean;
} & (
  | {
      items: I[];
      children?: never;
      mapManaged?: never;
    }
  | {
      items?: never;
      children: ({ renderItem }: { renderItem: RenderItem<I> }) => React.ReactNode;
      mapManaged?: never;
    }
  | {
      items?: never;
      children?: never;
      mapManaged: MapManaged<I>;
    }
);

const DraggableList = <I extends unknown>({
  type,
  footer = null,
  filter,
  onDrop,
  itemProps,
  onEndDrag,
  onReorder,
  getItemKey = (item) => item as string,
  onStartDrag,
  deleteProps,
  itemComponent,
  previewOptions,
  deleteComponent,
  partialDragItem,
  previewComponent,
  unmountableDuringDrag,
  withContextMenuDelete,
  ...props
}: DraggableListProps<I>): JSX.Element => {
  const handlers = React.useRef<Handlers>({});
  const [dragging, updateDragging] = React.useState(false);
  const [deleteHovered, updateDeleteHovered] = React.useState(false);

  const [, connectDrop] = useDrop({
    hover: _throttle((item, monitor) => {
      if (item.deleteHovered && monitor.isOver({ shallow: true })) {
        updateDeleteHovered(false);
        return;
      }

      if (deleteHovered !== item.deleteHovered) {
        updateDeleteHovered(item.deleteHovered);
      }
    }, HOVER_THROTTLE_TIMEOUT),
    accept: type,
  });

  const onDeleteDrop = React.useCallback(
    (item: InternalItem<I>) => {
      updateDeleteHovered(false);
      props.onDelete?.(props.mapManaged ? item.itemKey : item.index, item);
    },
    [props.onDelete, props.mapManaged]
  );
  const onDragEnd = React.useCallback(
    (...args) => {
      updateDragging(false);
      onEndDrag?.(...args);
    },
    [onEndDrag]
  );
  const onDragStart = React.useCallback(
    (...args) => {
      updateDragging(true);
      onStartDrag?.(...args);
    },
    [onStartDrag]
  );
  const onToggleHoverDelete = React.useCallback((value) => updateDeleteHovered(value), [updateDeleteHovered]);

  handlers.current = { onDrop, onDragEnd, onReorder, onDragStart, onToggleHoverDelete, onDeleteDrop, deleteHovered };

  const renderItem: RenderItem<I> = (data) => (
    <DnDItem
      {...itemProps}
      onRemove={onDeleteDrop}
      {...data}
      type={type}
      handlers={handlers}
      partialDrag={partialDragItem}
      itemComponent={itemComponent}
      unmountableDuringDrag={unmountableDuringDrag}
      withContextMenuDelete={withContextMenuDelete}
    />
  );

  return (
    <ListContainer ref={connectDrop}>
      {!props.children &&
        (props.mapManaged
          ? props.mapManaged((item, { key, index, onRemove, onUpdate }) => {
              const itemData = {
                key,
                item,
                index,
                itemKey: key,
                onRemove,
                onUpdate,
              };

              if (filter) {
                return filter(item) ? renderItem(itemData) : <span key={key} />;
              }

              return renderItem(itemData);
            })
          : props.items.map((item, index) => {
              const itemData = {
                key: getItemKey(item) as string,
                item,
                index,
                itemKey: getItemKey(item) as string,
              };

              if (filter) {
                return filter(item) ? renderItem(itemData) : <span key={getItemKey(item)} />;
              }

              return renderItem(itemData);
            }))}

      {!!props.children && props.children({ renderItem })}

      {footer}

      <DragPreview type={type} options={previewOptions} component={previewComponent} handlers={handlers} />

      {!!deleteComponent && dragging && <DropDelete type={type} handlers={handlers} deleteComponent={deleteComponent} deleteProps={deleteProps} />}
    </ListContainer>
  );
};

export default DraggableList;

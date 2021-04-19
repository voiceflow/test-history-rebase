import _throttle from 'lodash/throttle';
import React from 'react';
import { DragSourceMonitor, useDrop } from 'react-dnd';

import { HOVER_THROTTLE_TIMEOUT } from '@/constants';
import { MapManaged } from '@/hooks';
import { MenuOption } from '@/types';

import { DeleteComponent, DnDItem, DragPreview, DragPreviewComponentProps, DropDelete, ItemComponentProps, ListContainer } from './components';
import { Handlers, InternalItem } from './types';

export { DeleteComponent };
export type { DragPreviewComponentProps, ItemComponentProps };

export type BaseItemData<I> = Omit<InternalItem<I>, 'type'>;

export type MappedItemProps<I> = {
  onRemove: () => void;
  onUpdate: (value: Partial<I>) => void;
};

export type MappedItemData<I> = BaseItemData<I> & MappedItemProps<I>;

export type DraggableListProps<I, D, C> = {
  type: string;
  filter?: (item: I) => boolean;
  footer?: React.ReactNode;
  onDrop?: (item: InternalItem<I>) => unknown;
  itemProps?: C;
  onEndDrag?: (result: void, monitor: DragSourceMonitor) => unknown;
  onReorder?: (dragIndex: number, hoverIndex: number) => void;
  fullHeight?: boolean;
  getItemKey?: (item: I) => string;
  onStartDrag?: (monitor: DragSourceMonitor) => void;
  deleteProps?: D;
  deleteComponent?: React.NamedExoticComponent<React.PropsWithoutRef<D> & React.RefAttributes<any>>;
  partialDragItem?: boolean;
  contextMenuOptions?: MenuOption[];
  renderDeleteDelayed?: boolean;
  unmountableDuringDrag?: boolean;
  withContextMenuDelete?: boolean;
} & (
  | {
      items: I[];
      onDelete?: (key: number, item: BaseItemData<I>) => void;
      children?: never;
      mapManaged?: never;
      itemComponent: React.NamedExoticComponent<React.PropsWithoutRef<ItemComponentProps<I> & C> & React.RefAttributes<HTMLElement>>;
      previewComponent: React.NamedExoticComponent<ItemComponentProps<I> & C & DragPreviewComponentProps>;
    }
  | {
      items?: never;
      children: (options: { renderItem: (data: BaseItemData<I>) => React.ReactNode }) => React.ReactNode;
      onDelete?: (index: number, item: BaseItemData<I>) => void;
      mapManaged?: never;
      itemComponent: React.NamedExoticComponent<React.PropsWithoutRef<ItemComponentProps<I> & C> & React.RefAttributes<HTMLElement>>;
      previewComponent: React.NamedExoticComponent<ItemComponentProps<I> & C & DragPreviewComponentProps>;
    }
  | {
      items?: never;
      children?: never;
      onDelete?: (key: string, item: BaseItemData<I>) => void;
      mapManaged: MapManaged<I>;
      itemComponent: React.NamedExoticComponent<
        React.PropsWithoutRef<ItemComponentProps<I> & MappedItemProps<I> & C> & React.RefAttributes<HTMLElement>
      >;
      previewComponent: React.NamedExoticComponent<ItemComponentProps<I> & MappedItemProps<I> & C & DragPreviewComponentProps>;
    }
);

const DraggableList = <I, D, C>({
  type,
  footer = null,
  filter,
  onDrop,
  itemProps,
  onEndDrag,
  onReorder,
  fullHeight = true,
  getItemKey = (item) => item as any,
  onStartDrag,
  deleteProps,
  itemComponent,
  deleteComponent,
  partialDragItem,
  previewComponent,
  renderDeleteDelayed,
  unmountableDuringDrag,
  withContextMenuDelete,
  ...props
}: DraggableListProps<I, D, C>): JSX.Element => {
  const handlers = React.useRef<Handlers<I>>({});
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
    (item: BaseItemData<I>) => {
      updateDeleteHovered(false);

      if (props.mapManaged) {
        props.onDelete?.(item.itemKey, item);
      } else {
        props.onDelete?.(item.index, item);
      }
    },
    [props.onDelete, props.mapManaged]
  );
  const onDragEnd = React.useCallback(
    (result: void, monitor: DragSourceMonitor) => {
      updateDragging(false);
      onEndDrag?.(result, monitor);
    },
    [onEndDrag]
  );
  const onDragStart = React.useCallback(
    (monitor: DragSourceMonitor) => {
      updateDragging(true);
      onStartDrag?.(monitor);
    },
    [onStartDrag]
  );

  handlers.current = { onDrop, onDragEnd, onReorder, onDragStart, onDeleteDrop, deleteHovered };

  const renderItem = (data: MappedItemData<I> | BaseItemData<I>) => (
    <DnDItem
      {...itemProps}
      onRemove={onDeleteDrop}
      {...data}
      type={type}
      handlers={handlers}
      partialDrag={partialDragItem}
      itemComponent={itemComponent as any}
      unmountableDuringDrag={unmountableDuringDrag}
      withContextMenuDelete={withContextMenuDelete}
    />
  );

  return (
    <ListContainer ref={connectDrop} fullHeight={fullHeight}>
      {!props.children &&
        (props.mapManaged
          ? props.mapManaged((item, { key, index, onRemove, onUpdate }) => {
              const itemData: MappedItemData<I> = {
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
                key: getItemKey(item),
                item,
                index,
                itemKey: getItemKey(item),
              };

              if (filter) {
                return filter(item) ? renderItem(itemData) : <span key={getItemKey(item)} />;
              }

              return renderItem(itemData);
            }))}

      {!!props.children && props.children({ renderItem })}

      {footer}

      <DragPreview<I> type={type} component={previewComponent as any} handlers={handlers} />

      {!!deleteComponent && dragging && (
        <DropDelete type={type} handlers={handlers} renderDelayed={renderDeleteDelayed} deleteComponent={deleteComponent} deleteProps={deleteProps} />
      )}
    </ListContainer>
  );
};

export default DraggableList;

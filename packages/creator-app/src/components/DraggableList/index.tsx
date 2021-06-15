import _throttle from 'lodash/throttle';
import React from 'react';
import { DragSourceMonitor, useDrop } from 'react-dnd';

import { HOVER_THROTTLE_TIMEOUT } from '@/constants';
import { MapManaged } from '@/hooks';
import { MenuOption } from '@/types';

import {
  DeleteComponent,
  DnDItem,
  DragPreview,
  DragPreviewComponentProps,
  DropDelete,
  ItemComponentHandlers,
  ItemComponentProps,
  ListContainer,
  MappedItemComponentHandlers,
} from './components';
import { DnDHandlers, DnDItem as DnDInternalItem, InternalItem } from './types';

export { DeleteComponent };
export type { DragPreviewComponentProps, ItemComponentHandlers, ItemComponentProps, MappedItemComponentHandlers };

export type BaseItemData<I> = Omit<InternalItem<I>, 'type'>;

export type MapManagedEditActionHandler<I> = (key: string, item: BaseItemData<I>) => void;
export type IndexableEditActionHandler<I> = (index: number, item: BaseItemData<I>) => void;

export type DraggableListProps<I, D, C> = {
  type: string;
  filter?: (item: I) => boolean;
  footer?: React.ReactNode;
  onDrop?: (item: DnDInternalItem<I>) => unknown;
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
  unmountableDuringDrag?: boolean;
  withContextMenuDelete?: boolean;
  withContextMenuDuplicate?: boolean;
} & (
  | {
      items: I[];
      onDelete?: IndexableEditActionHandler<I>;
      children?: never;
      mapManaged?: never;
      onDuplicate?: IndexableEditActionHandler<I>;
      itemComponent: React.NamedExoticComponent<
        React.PropsWithoutRef<ItemComponentProps<I> & ItemComponentHandlers<I> & C> & React.RefAttributes<HTMLElement>
      >;
      previewComponent: React.NamedExoticComponent<ItemComponentProps<I> & ItemComponentHandlers<I> & C & DragPreviewComponentProps>;
    }
  | {
      items?: never;
      children: (options: { renderItem: (data: BaseItemData<I>) => React.ReactNode }) => React.ReactNode;
      onDelete?: IndexableEditActionHandler<I>;
      mapManaged?: never;
      onDuplicate?: IndexableEditActionHandler<I>;
      itemComponent: React.NamedExoticComponent<
        React.PropsWithoutRef<ItemComponentProps<I> & ItemComponentHandlers<I> & C> & React.RefAttributes<HTMLElement>
      >;
      previewComponent: React.NamedExoticComponent<ItemComponentProps<I> & ItemComponentHandlers<I> & C & DragPreviewComponentProps>;
    }
  | {
      items?: never;
      children?: never;
      onDelete?: MapManagedEditActionHandler<I>;
      mapManaged: MapManaged<I>;
      onDuplicate?: MapManagedEditActionHandler<I>;
      itemComponent: React.NamedExoticComponent<
        React.PropsWithoutRef<ItemComponentProps<I> & MappedItemComponentHandlers<I> & C> & React.RefAttributes<HTMLElement>
      >;
      previewComponent: React.NamedExoticComponent<ItemComponentProps<I> & MappedItemComponentHandlers<I> & C & DragPreviewComponentProps>;
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
  unmountableDuringDrag,
  withContextMenuDelete,
  withContextMenuDuplicate,
  ...props
}: DraggableListProps<I, D, C>): JSX.Element => {
  const handlers = React.useRef<DnDHandlers<I>>({});
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
  const onItemDuplicate = React.useCallback(
    (item: BaseItemData<I>) => {
      if (props.mapManaged) {
        props.onDuplicate?.(item.itemKey, item);
      } else {
        props.onDuplicate?.(item.index, item);
      }
    },
    [props.onDuplicate]
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

  React.useEffect(
    () => () => {
      connectDrop(null);
    },
    [connectDrop]
  );

  handlers.current = { onDrop, onDragEnd, onReorder, onDragStart, onDeleteDrop, deleteHovered };

  const renderItem = (data: (BaseItemData<I> & MappedItemComponentHandlers<I>) | BaseItemData<I>) => (
    <DnDItem
      {...itemProps}
      onRemove={onDeleteDrop}
      onDuplicate={onItemDuplicate}
      {...data}
      type={type}
      handlers={handlers}
      partialDrag={partialDragItem}
      itemComponent={itemComponent as any}
      unmountableDuringDrag={unmountableDuringDrag}
      withContextMenuDelete={withContextMenuDelete}
      withContextMenuDuplicate={withContextMenuDuplicate}
    />
  );

  return (
    <ListContainer ref={connectDrop} fullHeight={fullHeight}>
      {!props.children &&
        (props.mapManaged
          ? props.mapManaged((item, { key, index, onRemove, onUpdate }) => {
              const itemData: BaseItemData<I> & MappedItemComponentHandlers<I> = {
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
              const itemData: BaseItemData<I> = {
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

      {!!deleteComponent && dragging && <DropDelete type={type} handlers={handlers} deleteComponent={deleteComponent} deleteProps={deleteProps} />}
    </ListContainer>
  );
};

export default DraggableList;

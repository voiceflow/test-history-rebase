import { Nullable } from '@voiceflow/common';
import { ContextMenuProps, useCache } from '@voiceflow/ui';
// eslint-disable-next-line you-dont-need-lodash-underscore/throttle
import _throttle from 'lodash/throttle';
import React from 'react';
import { DragSourceMonitor, useDrop } from 'react-dnd';

import { HOVER_THROTTLE_TIMEOUT } from '@/constants';
import { MapManaged, PreviewOptions } from '@/hooks';

import {
  ContextMenuOption,
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
export type { ContextMenuOption, DragPreviewComponentProps, ItemComponentHandlers, ItemComponentProps, MappedItemComponentHandlers };

export type BaseItemData<I> = Omit<InternalItem<I>, 'type'>;

export type MapManagedEditActionHandler<I> = (key: string, item: BaseItemData<I>) => void;
export type IndexableEditActionHandler<I> = (index: number, item: BaseItemData<I>) => void;

export type DraggableListProps<I, D, C> = {
  type: string;
  filter?: (item: I) => boolean;
  footer?: React.ReactNode;
  onDrop?: (item: DnDInternalItem<I>) => unknown;
  canDrag?: DnDHandlers<I>['canDrag'];
  canDrop?: DnDHandlers<I>['canDrop'];
  itemProps?: C;
  onEndDrag?: DnDHandlers<I>['onDragEnd'];
  onReorder?: DnDHandlers<I>['onReorder'];
  canReorder?: DnDHandlers<I>['canReorder'];
  fullHeight?: boolean;
  getItemKey?: (item: I) => string;
  onStartDrag?: DnDHandlers<I>['onDragStart'];
  deleteProps?: D;
  previewOptions?: PreviewOptions;
  deleteComponent?: Nullable<React.NamedExoticComponent<React.PropsWithoutRef<D> & React.RefAttributes<any>>>;
  partialDragItem?: boolean;
  contextMenuOptions?: ContextMenuOption<I>[];
  contextMenuProps?: Partial<ContextMenuProps<I>>;
  unmountableDuringDrag?: boolean;
  withContextMenuDelete?: boolean;
  contextMenuDeleteLabel?: string;
  contextMenuSelfDismiss?: boolean;
  withContextMenuDuplicate?: boolean;
  disableReorderingWhileDraggingX?: boolean;
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
  canDrag,
  canDrop,
  itemProps,
  onEndDrag,
  onReorder,
  fullHeight = true,
  getItemKey = (item) => item as any,
  canReorder,
  onStartDrag,
  deleteProps,
  itemComponent,
  previewOptions,
  deleteComponent,
  partialDragItem,
  contextMenuProps,
  previewComponent,
  contextMenuOptions,
  unmountableDuringDrag,
  withContextMenuDelete,
  contextMenuDeleteLabel,
  contextMenuSelfDismiss,
  withContextMenuDuplicate,
  disableReorderingWhileDraggingX,
  ...props
}: DraggableListProps<I, D, C>): JSX.Element => {
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
    (item: I, monitor: DragSourceMonitor) => {
      updateDragging(false);
      onEndDrag?.(item, monitor);
    },
    [onEndDrag]
  );
  const onDragStart = React.useCallback(
    (item: I, monitor: DragSourceMonitor) => {
      updateDragging(true);
      onStartDrag?.(item, monitor);
    },
    [onStartDrag]
  );

  React.useEffect(
    () => () => {
      connectDrop(null);
    },
    [connectDrop]
  );

  const handlers = useCache<DnDHandlers<I>>({
    onDrop,
    canDrag,
    canDrop,
    onDragEnd,
    onReorder,
    canReorder,
    onDragStart,
    onDeleteDrop,
    deleteHovered,
  });

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
      contextMenuProps={contextMenuProps}
      contextMenuOptions={contextMenuOptions}
      unmountableDuringDrag={unmountableDuringDrag}
      withContextMenuDelete={withContextMenuDelete}
      contextMenuDeleteLabel={contextMenuDeleteLabel}
      contextMenuSelfDismiss={contextMenuSelfDismiss}
      withContextMenuDuplicate={withContextMenuDuplicate}
      disableReorderingWhileDraggingX={disableReorderingWhileDraggingX}
    />
  );

  return (
    <ListContainer ref={connectDrop} fullHeight={fullHeight}>
      {!props.children &&
        (props.mapManaged
          ? props.mapManaged((item, { key, index, isFirst, isLast, onRemove, onUpdate }) => {
              const itemData: BaseItemData<I> & MappedItemComponentHandlers<I> = {
                key,
                item,
                index,
                isLast,
                isFirst,
                itemKey: key,
                onRemove,
                onUpdate,
                isDragActive: dragging,
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
                isLast: index === props.items.length - 1,
                isFirst: index === 0,
                itemKey: getItemKey(item),
                isDragActive: dragging,
              };

              if (filter) {
                return filter(item) ? renderItem(itemData) : <span key={getItemKey(item)} />;
              }

              return renderItem(itemData);
            }))}

      {!!props.children && props.children({ renderItem })}

      {footer}

      <DragPreview<I> type={type} component={previewComponent as any} handlers={handlers} options={previewOptions} />

      {!!deleteComponent && dragging && <DropDelete type={type} handlers={handlers} deleteComponent={deleteComponent} deleteProps={deleteProps} />}
    </ListContainer>
  );
};

export default DraggableList;

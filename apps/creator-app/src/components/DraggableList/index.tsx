import compositeRef from '@seznam/compose-react-refs';
import type { Nullable } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import type { ContextMenuProps } from '@voiceflow/ui';
import { useCache, useContextApi, usePersistFunction } from '@voiceflow/ui';
import _throttle from 'lodash/throttle';
import React from 'react';
import type { DragSourceMonitor } from 'react-dnd';
import { useDrop } from 'react-dnd';

import { HOVER_THROTTLE_TIMEOUT } from '@/constants';
import type { MapManagedFactoryAPI, MapManagedSimpleAPI } from '@/hooks';
import type { DragPreviewOptions } from '@/hooks/dnd.hook';

import type {
  ContextMenuOption,
  DeleteComponentProps,
  DragPreviewComponentProps,
  ItemComponentHandlers,
  ItemComponentProps,
  MappedItemComponentHandlers,
} from './components';
import { DeleteComponent, DnDItem, DragPreview, DropDelete, ListContainer } from './components';
import { ChildrenContextProvider, useChildrenContext } from './context';
import type { BaseItemData, DnDHandlers, DnDItem as DnDInternalItem } from './types';

export { DeleteComponent, useChildrenContext as useDraggableListChildrenContext };
export type {
  BaseItemData,
  ContextMenuOption,
  DeleteComponentProps,
  DragPreviewComponentProps,
  ItemComponentHandlers,
  ItemComponentProps,
  MappedItemComponentHandlers,
};

export type IndexableEditActionHandler<Item> = (index: number, item: Item, data: BaseItemData<Item>) => void;

export interface DraggableListHandlers<Item> {
  canDrag?: DnDHandlers<Item>['canDrag'];
  canDrop?: DnDHandlers<Item>['canDrop'];
  onEndDrag?: DnDHandlers<Item>['onDragEnd'];
  canReorder?: DnDHandlers<Item>['canReorder'];
  onStartDrag?: DnDHandlers<Item>['onDragStart'];
}

interface DraggableListBaseProps<Item, DeleteProps, ExtraItemProps> extends DraggableListHandlers<Item> {
  type: string;
  flex?: boolean;
  filter?: (item: Item) => boolean;
  footer?: React.ReactNode;
  onDrop?: (item: DnDInternalItem<Item>) => unknown;
  itemProps?: ExtraItemProps;
  fullHeight?: boolean;
  getItemKey?: (item: Item) => string;
  deleteProps?: DeleteProps;
  containerRef?: React.Ref<HTMLDivElement>;
  previewOptions?: DragPreviewOptions;
  deleteComponent?: Nullable<React.NamedExoticComponent<React.PropsWithoutRef<DeleteProps> & React.RefAttributes<any>>>;
  partialDragItem?: boolean;
  contextMenuProps?: Partial<ContextMenuProps<Item>>;
  contextMenuOptions?: ContextMenuOption<Item>[];
  unmountableDuringDrag?: boolean;
  withContextMenuDelete?: boolean;
  contextMenuDeleteLabel?: string;
  contextMenuSelfDismiss?: boolean;
  withContextMenuDuplicate?: boolean;
  disableReorderingWhileDraggingX?: boolean;
}

export interface DraggableListIndexedProps<Item, DeleteProps, ExtraItemProps>
  extends DraggableListBaseProps<Item, DeleteProps, ExtraItemProps> {
  onDelete?: IndexableEditActionHandler<Item>;
  onReorder?: DnDHandlers<Item>['onReorder'];
  mapManager?: never;
  onDuplicate?: IndexableEditActionHandler<Item>;
  itemComponent: React.NamedExoticComponent<
    React.PropsWithoutRef<ItemComponentProps<Item> & ItemComponentHandlers<Item> & ExtraItemProps> &
      React.RefAttributes<HTMLElement>
  >;
  previewComponent: React.NamedExoticComponent<
    React.PropsWithoutRef<
      ItemComponentProps<Item> & ItemComponentHandlers<Item> & ExtraItemProps & DragPreviewComponentProps
    >
  >;
  mapManagerFactory?: never;
}

export interface DraggableListItemsProps<Item, DeleteProps, ExtraItemProps>
  extends DraggableListIndexedProps<Item, DeleteProps, ExtraItemProps> {
  items: Item[];
  children?: never;
}

export interface DraggableListChildrenProps<Item, DeleteProps, ExtraItemProps>
  extends DraggableListIndexedProps<Item, DeleteProps, ExtraItemProps> {
  items?: never;
  children: (options: { renderItem: (data: BaseItemData<Item>) => React.ReactNode }) => React.ReactNode;
}

interface DraggableListBaseMapManagerProps<Item, DeleteProps, ExtraItemProps>
  extends DraggableListBaseProps<Item, DeleteProps, ExtraItemProps> {
  items?: never;
  children?: never;
  onDelete?: never;
  onReorder?: never;
  mapManager: MapManagedSimpleAPI<Item>;
  onDuplicate?: never;
  itemComponent: React.NamedExoticComponent<
    React.PropsWithoutRef<ItemComponentProps<Item> & MappedItemComponentHandlers<Item> & ExtraItemProps> &
      React.RefAttributes<HTMLElement>
  >;
  previewComponent: React.NamedExoticComponent<
    React.PropsWithoutRef<
      ItemComponentProps<Item> & MappedItemComponentHandlers<Item> & ExtraItemProps & DragPreviewComponentProps
    >
  >;
}

export interface DraggableListSimpleMapManagerProps<Item, DeleteProps, ExtraItemProps>
  extends DraggableListBaseMapManagerProps<Item, DeleteProps, ExtraItemProps> {
  mapManager: MapManagedSimpleAPI<Item>;
  mapManagerFactory: (item: Item, data: BaseItemData<Item>) => Item;
}

export interface DraggableListFactoryMapManagerProps<Item, DeleteProps, ExtraItemProps>
  extends DraggableListBaseMapManagerProps<Item, DeleteProps, ExtraItemProps> {
  mapManager: MapManagedFactoryAPI<Item>;
  mapManagerFactory?: never;
}

interface DraggableListComponent {
  <Item, DeleteProps, ExtraItemProps>(props: DraggableListItemsProps<Item, DeleteProps, ExtraItemProps>): JSX.Element;
  <Item, DeleteProps, ExtraItemProps>(
    props: DraggableListChildrenProps<Item, DeleteProps, ExtraItemProps>
  ): JSX.Element;
  <Item, DeleteProps, ExtraItemProps>(
    props: DraggableListSimpleMapManagerProps<Item, DeleteProps, ExtraItemProps>
  ): JSX.Element;
  <Item, DeleteProps, ExtraItemProps>(
    props: DraggableListFactoryMapManagerProps<Item, DeleteProps, ExtraItemProps>
  ): JSX.Element;
}

const DraggableList: DraggableListComponent = ({
  type,
  flex,
  footer = null,
  filter,
  onDrop,
  canDrag,
  canDrop,
  itemProps,
  onEndDrag,
  onReorder,
  fullHeight = true,
  getItemKey: getItemKeyProp,
  canReorder,
  onStartDrag,
  deleteProps,
  containerRef,
  itemComponent,
  previewOptions,
  deleteComponent,
  partialDragItem,
  contextMenuProps,
  previewComponent,
  mapManagerFactory,
  contextMenuOptions,
  unmountableDuringDrag,
  withContextMenuDelete,
  contextMenuDeleteLabel,
  contextMenuSelfDismiss = true,
  withContextMenuDuplicate,
  disableReorderingWhileDraggingX,
  ...props
}) => {
  type Item = Parameters<NonNullable<typeof onStartDrag>>[0];

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
    (item: BaseItemData<Item>) => {
      updateDeleteHovered(false);

      if (props.mapManager?.onRemove) {
        props.mapManager.onRemove(item.itemKey);
      } else {
        props.onDelete?.(item.index, item.item, item);
      }
    },
    [props.onDelete, props.mapManager?.onRemove]
  );

  const persistedMapManagerFactory = usePersistFunction(mapManagerFactory);
  const getItemKey = usePersistFunction(
    getItemKeyProp ?? ((item: Item) => (Utils.object.isObject(item) ? String(item?.id) : String(item)))
  );

  const onItemDuplicate = React.useCallback(
    (item: BaseItemData<Item>) => {
      if (props.mapManager?.onDuplicate) {
        props.mapManager.onDuplicate?.(item.index, item.item, persistedMapManagerFactory(item.item, item));
      } else {
        props.onDuplicate?.(item.index, item.item, item);
      }
    },
    [props.onDuplicate, props.mapManager?.onDuplicate]
  );

  const onDragEnd = React.useCallback(
    (item: Item, monitor: DragSourceMonitor) => {
      updateDragging(false);
      onEndDrag?.(item, monitor);
    },
    [onEndDrag]
  );

  const onDragStart = React.useCallback(
    (item: Item, monitor: DragSourceMonitor) => {
      updateDragging(true);
      onStartDrag?.(item, monitor);
    },
    [onStartDrag]
  );

  const handlers = useCache<DnDHandlers<Item>>({
    onDrop,
    canDrag,
    canDrop,
    onDragEnd,
    onReorder: props.mapManager?.onReorder || onReorder,
    canReorder,
    onDragStart,
    onDeleteDrop,
    deleteHovered,
  });

  const itemExtraProps = useContextApi(itemProps ?? {});

  const renderItem = React.useCallback(
    (data: (BaseItemData<Item> & MappedItemComponentHandlers<Item>) | BaseItemData<Item>) => (
      <DnDItem
        {...itemExtraProps}
        onRemove={onDeleteDrop}
        onDuplicate={onItemDuplicate}
        {...data}
        type={type}
        handlers={handlers}
        getItemKey={getItemKey}
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
    ),
    [
      type,
      handlers,
      onDeleteDrop,
      itemComponent,
      itemExtraProps,
      onItemDuplicate,
      partialDragItem,
      contextMenuProps,
      contextMenuOptions,
      unmountableDuringDrag,
      withContextMenuDelete,
      contextMenuDeleteLabel,
      contextMenuSelfDismiss,
      withContextMenuDuplicate,
      disableReorderingWhileDraggingX,
    ]
  );

  const childContext = useContextApi({ renderItem });

  return (
    <ListContainer ref={compositeRef(connectDrop as any, containerRef)} flex={flex} fullHeight={fullHeight}>
      {!props.children &&
        (props.mapManager
          ? props.mapManager.map((item, { key, index, isFirst, isLast, onRemove, onUpdate }) => {
              const itemData: BaseItemData<Item> & MappedItemComponentHandlers<Item> = {
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

              if (filter) return filter(item) ? renderItem(itemData) : <span key={key} />;

              return renderItem(itemData);
            })
          : props.items?.map((item, index) => {
              const itemData: BaseItemData<Item> = {
                key: getItemKey(item),
                item,
                index,
                isLast: index === (props.items?.length ?? 0) - 1,
                isFirst: index === 0,
                itemKey: getItemKey(item),
                isDragActive: dragging,
              };

              if (filter) return filter(item) ? renderItem(itemData) : <span key={getItemKey(item)} />;

              return renderItem(itemData);
            }))}

      {!!props.children && (
        <ChildrenContextProvider value={childContext}>{props.children({ renderItem })}</ChildrenContextProvider>
      )}

      {footer}

      <DragPreview<React.ComponentProps<typeof previewComponent>>
        type={type}
        options={previewOptions}
        handlers={handlers}
        component={previewComponent as React.NamedExoticComponent<React.ComponentProps<typeof previewComponent>>}
      />

      {!!deleteComponent && dragging && (
        <DropDelete type={type} handlers={handlers} deleteComponent={deleteComponent} deleteProps={deleteProps} />
      )}
    </ListContainer>
  );
};

export default DraggableList;

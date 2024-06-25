import type { ContextMenuProps, MenuTypes } from '@voiceflow/ui';
import { ContextMenu } from '@voiceflow/ui';
import React from 'react';

import type { DnDHandlers, InternalItem } from '../types';
import useDragAndDrop from '../useDragAndDrop';

type InternalWithoutType<I> = Omit<InternalItem<I>, 'type'>;

export interface ContextMenuOption<I> extends Omit<MenuTypes.OptionWithoutValue, 'onClick'> {
  onClick?: (props: InternalWithoutType<I>) => void;
}

export interface ItemComponentHandlers<I> {
  onRemove: (props: InternalWithoutType<I>) => void;
  onUpdate?: never;
  onDuplicate?: (props: InternalWithoutType<I>) => void;
}

export interface MappedItemComponentHandlers<I> {
  onRemove: VoidFunction;
  onUpdate: (value: Partial<I>) => void;
  onDuplicate?: (props: InternalWithoutType<I>) => void;
}

export interface ItemComponentProps<I> extends InternalWithoutType<I> {
  style?: { opacity: number };
  isDragging: boolean;
  onContextMenu?: (event: React.MouseEvent<HTMLElement>) => void;
  connectedDragRef: React.RefObject<HTMLElement>;
  isContextMenuOpen?: boolean;
}

export type DnDItemProps<I> = InternalItem<I> & {
  type: string;
  handlers: { current: DnDHandlers<I> };
  getItemKey: (item: I) => string;
  partialDrag?: boolean;
  itemComponent: React.NamedExoticComponent<
    React.PropsWithoutRef<ItemComponentProps<I> & (ItemComponentHandlers<I> | MappedItemComponentHandlers<I>)> &
      React.RefAttributes<HTMLElement>
  >;
  contextMenuOptions?: ContextMenuOption<I>[];
  contextMenuProps?: Partial<ContextMenuProps<I>>;
  withContextMenuDelete?: boolean;
  unmountableDuringDrag?: boolean;
  contextMenuDeleteLabel?: string;
  contextMenuSelfDismiss?: boolean;
  withContextMenuDuplicate?: boolean;
  disableReorderingWhileDraggingX?: boolean;
} & (ItemComponentHandlers<I> | MappedItemComponentHandlers<I>);

const DnDItem = <P extends DnDItemProps<any>>({
  type,
  handlers,
  getItemKey,
  partialDrag,
  itemComponent: Item,
  contextMenuProps,
  contextMenuOptions,
  withContextMenuDelete,
  unmountableDuringDrag,
  contextMenuDeleteLabel = 'Delete',
  contextMenuSelfDismiss,
  withContextMenuDuplicate,
  disableReorderingWhileDraggingX,
  ...props
}: P) => {
  const [{ isDragging, isDraggingXEnabled }, connectedRootRef, connectedDragRef] = useDragAndDrop(
    type,
    handlers,
    props,
    {
      getItemKey,
      partialDrag,
      unmountableDuringDrag,
      disableReorderingWhileDraggingX,
    }
  );

  const menuOptions = React.useMemo(() => {
    const options = [];

    if (contextMenuOptions) {
      options.push(
        ...contextMenuOptions.map((option) => ({
          ...option,
          onClick: option.onClick ? () => option.onClick?.(props) : undefined,
        }))
      );
    }

    if (withContextMenuDuplicate) {
      options.push({ label: 'Duplicate', onClick: () => props.onDuplicate?.(props) });
    }

    if (withContextMenuDelete) {
      options.push({ label: contextMenuDeleteLabel, onClick: () => props.onRemove(props) });
    }

    return options;
  }, [props.onRemove, props.onDuplicate, withContextMenuDelete, contextMenuOptions, props.item]);

  const itemProps = {
    ...props,
    ref: connectedRootRef,
    style: { opacity: isDragging ? 0 : 1 },
    isDragging,
    connectedDragRef,
    isDraggingXEnabled,
    disableReorderingWhileDraggingX,
  } as ItemComponentProps<any> & (ItemComponentHandlers<any> | MappedItemComponentHandlers<any>);

  if (menuOptions.length) {
    return (
      <ContextMenu selfDismiss={contextMenuSelfDismiss} {...contextMenuProps} options={menuOptions}>
        {({ isOpen, onContextMenu }) => (
          <Item {...itemProps} onContextMenu={onContextMenu} isContextMenuOpen={isOpen} />
        )}
      </ContextMenu>
    );
  }

  return <Item {...itemProps} />;
};

export default React.memo(DnDItem) as <P extends DnDItemProps<any>>(props: P) => JSX.Element;

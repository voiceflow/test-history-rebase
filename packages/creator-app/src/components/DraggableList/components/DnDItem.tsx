import React from 'react';

import ContextMenu from '@/components/ContextMenu';
import { MenuOption } from '@/types';

import { DnDHandlers, InternalItem } from '../types';
import useDragAndDrop from '../useDragAndDrop';

type InternalWithoutType<I> = Omit<InternalItem<I>, 'type'>;

export interface ItemComponentHandlers<I> {
  onRemove: (props: InternalWithoutType<I>) => void;
  onUpdate?: never;
  onDuplicate?: (props: InternalWithoutType<I>) => void;
}

export interface MappedItemComponentHandlers<I> {
  onRemove: () => void;
  onUpdate: (value: Partial<I>) => void;
  onDuplicate?: (props: InternalWithoutType<I>) => void;
}

export type ItemComponentProps<I> = InternalWithoutType<I> & {
  style?: { opacity: number };
  isDragging: boolean;
  onContextMenu?: (event: React.MouseEvent<HTMLElement>) => void;
  connectedDragRef: React.RefObject<HTMLElement>;
  isContextMenuOpen?: boolean;
};

export type DnDItemProps<I> = InternalItem<I> & {
  type: string;
  handlers: { current: DnDHandlers<I> };
  partialDrag?: boolean;
  itemComponent: React.NamedExoticComponent<
    React.PropsWithoutRef<ItemComponentProps<I> & (ItemComponentHandlers<I> | MappedItemComponentHandlers<I>)> & React.RefAttributes<HTMLElement>
  >;
  contextMenuOptions?: MenuOption[];
  withContextMenuDelete?: boolean;
  unmountableDuringDrag?: boolean;
  withContextMenuDuplicate?: boolean;
} & (ItemComponentHandlers<I> | MappedItemComponentHandlers<I>);

const DnDItem = <P extends DnDItemProps<any>>({
  type,
  handlers,
  partialDrag,
  itemComponent: Item,
  contextMenuOptions,
  withContextMenuDelete,
  unmountableDuringDrag,
  withContextMenuDuplicate,
  ...props
}: P) => {
  const [isDragging, connectedRootRef, connectedDragRef] = useDragAndDrop(type, handlers, props, { partialDrag, unmountableDuringDrag });

  const menuOptions = React.useMemo(() => {
    const options = [];

    if (contextMenuOptions) {
      options.push(...contextMenuOptions);
    }

    if (withContextMenuDuplicate) {
      options.push({ label: 'Duplicate', onClick: () => props.onDuplicate?.(props) });
    }

    if (withContextMenuDelete) {
      options.push({ label: 'Delete', onClick: () => props.onRemove(props) });
    }

    return options;
  }, [props.onRemove, props.onDuplicate, withContextMenuDelete, contextMenuOptions, props.item]);

  const itemProps = {
    ...props,
    ref: connectedRootRef,
    style: { opacity: isDragging ? 0 : 1 },
    isDragging,
    connectedDragRef,
  } as ItemComponentProps<any> & (ItemComponentHandlers<any> | MappedItemComponentHandlers<any>);

  if (menuOptions.length) {
    return (
      <ContextMenu options={menuOptions}>
        {({ isOpen, onContextMenu }) => <Item {...itemProps} onContextMenu={onContextMenu} isContextMenuOpen={isOpen} />}
      </ContextMenu>
    );
  }

  return <Item {...itemProps} />;
};

export default React.memo(DnDItem) as <P extends DnDItemProps<any>>(props: P) => JSX.Element;

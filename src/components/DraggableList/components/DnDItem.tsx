import React from 'react';

import ContextMenu from '@/components/ContextMenu';
import { MenuOption } from '@/types';

import { Handlers, InternalItem } from '../types';
import useDragAndDrop from '../useDragAndDrop';

type ItemComponentProps = {
  ref: React.ReactElement | null;
  style: object;
  onRemove: (item: any) => void;
  isDragging: boolean;
  onContextMenu?: React.MouseEvent;
  connectedDragRef: React.ReactElement | null;
  isContextMenuOpen?: boolean;
};

export type DnDItemProps<I extends unknown> = InternalItem<I> & {
  type: string;
  onRemove: (item: any) => void;
  handlers: { current: Handlers };
  partialDrag?: boolean;
  itemComponent: React.FC<ItemComponentProps>;
  contextMenuOptions?: MenuOption[];
  withContextMenuDelete?: boolean;
  unmountableDuringDrag?: boolean;
};

const DnDItem = <I extends unknown>({
  type,
  handlers,
  onRemove,
  partialDrag,
  itemComponent: Item,
  contextMenuOptions,
  withContextMenuDelete,
  unmountableDuringDrag,
  ...props
}: DnDItemProps<I>) => {
  const [isDragging, connectedRootRef, connectedDragRef] = useDragAndDrop(type, handlers, props as any, { partialDrag, unmountableDuringDrag });

  const menuOptions = React.useMemo(() => {
    const options = [];

    if (contextMenuOptions) {
      options.push(...contextMenuOptions);
    }

    if (withContextMenuDelete) {
      options.push({ label: 'Delete', onClick: () => onRemove(props) });
    }

    return options;
  }, [onRemove, withContextMenuDelete, contextMenuOptions]);

  const itemProps = {
    ...props,
    ref: connectedRootRef,
    style: { opacity: isDragging ? 0 : 1 },
    onRemove,
    isDragging,
    connectedDragRef,
  };

  if (menuOptions.length) {
    return (
      <ContextMenu options={menuOptions}>
        {({ isOpen, onContextMenu }: { isOpen: boolean; onContextMenu: React.MouseEvent }) => (
          <Item {...itemProps} onContextMenu={onContextMenu} isContextMenuOpen={isOpen} />
        )}
      </ContextMenu>
    );
  }

  return <Item {...itemProps} />;
};

export default React.memo(DnDItem);

import React from 'react';

import ContextMenu from '@/components/ContextMenu';
import { MenuOption } from '@/types';

import { Handlers, InternalItem } from '../types';
import useDragAndDrop from '../useDragAndDrop';

export type ItemComponentProps<I> = Omit<InternalItem<I>, 'type'> & {
  style: { opacity: number };
  onRemove: (() => void) | ((props: Omit<InternalItem<I>, 'type'>) => void);
  isDragging: boolean;
  onContextMenu?: (event: React.MouseEvent<HTMLElement>) => void;
  connectedDragRef: React.RefObject<HTMLElement | null>;
  isContextMenuOpen?: boolean;
};

export type DnDItemProps<I> = InternalItem<I> & {
  type: string;
  onRemove: (() => void) | ((props: Omit<InternalItem<I>, 'type'>) => void);
  handlers: { current: Handlers<I> };
  partialDrag?: boolean;
  itemComponent: React.NamedExoticComponent<React.PropsWithoutRef<ItemComponentProps<I>> & React.RefAttributes<HTMLElement>>;
  contextMenuOptions?: MenuOption[];
  withContextMenuDelete?: boolean;
  unmountableDuringDrag?: boolean;
};

const DnDItem = <P extends DnDItemProps<any>>({
  type,
  handlers,
  onRemove,
  partialDrag,
  itemComponent: Item,
  contextMenuOptions,
  withContextMenuDelete,
  unmountableDuringDrag,
  ...props
}: P) => {
  const [isDragging, connectedRootRef, connectedDragRef] = useDragAndDrop(type, handlers, props, { partialDrag, unmountableDuringDrag });

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
        {({ isOpen, onContextMenu }) => <Item {...itemProps} onContextMenu={onContextMenu} isContextMenuOpen={isOpen} />}
      </ContextMenu>
    );
  }

  return <Item {...itemProps} />;
};

export default React.memo(DnDItem) as <P extends DnDItemProps<any>>(props: P) => JSX.Element;

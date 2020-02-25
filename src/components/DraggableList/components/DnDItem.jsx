import React from 'react';

import ContextMenu from '@/components/ContextMenu';

import useDragAndDrop from '../useDragAndDrop';

const DnDItem = ({ type, itemComponent: Item, handlers, partialDrag, contextMenuOptions, onRemove, withContextMenuDelete, ...props }) => {
  const [isDragging, connectedRootRef, connectedDragRef] = useDragAndDrop(type, handlers, partialDrag, props);

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

export default React.memo(DnDItem);

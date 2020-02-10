import React from 'react';

import useDragAndDrop from '../useDragAndDrop';

const DnDItem = ({ type, itemComponent: Item, handlers, partialDrag, ...props }) => {
  const [isDragging, connectedRootRef, connectedDragRef] = useDragAndDrop(type, handlers, partialDrag, props);

  return (
    <Item {...props} ref={connectedRootRef} style={{ opacity: isDragging ? 0 : 1 }} isDragging={isDragging} connectedDragRef={connectedDragRef} />
  );
};

export default React.memo(DnDItem);

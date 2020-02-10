import React from 'react';
import { useDrop } from 'react-dnd';

const DropDelete = ({ type, deleteComponent: Delete, handlers, deleteProps }) => {
  const rootRef = React.useRef(null);

  const [, connectDrop] = useDrop({
    drop: (item, ...args) => {
      item.deleteHovered = false;
      handlers.current.onDeleteDrop?.(item, ...args);

      return item;
    },
    accept: type,
    hover: (item) => {
      item.deleteHovered = true;
    },
  });

  const connectTarget = connectDrop(rootRef);

  return <Delete ref={connectTarget} {...deleteProps} />;
};

export default React.memo(DropDelete);

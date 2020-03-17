import React from 'react';
import { useDrop } from 'react-dnd';

import { Handlers, InternalItem } from '../types';

export type DropDeleteProps = {
  type: string;
  handlers: { current: Handlers };
  deleteProps?: Record<string, any>;
  deleteComponent: React.FC<{ ref: React.ReactElement | null }>;
};

const DropDelete = <I extends unknown>({ type, deleteComponent: Delete, handlers, deleteProps }: DropDeleteProps) => {
  const rootRef = React.useRef(null);

  const [, connectDrop] = useDrop<InternalItem<I>, unknown, unknown>({
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

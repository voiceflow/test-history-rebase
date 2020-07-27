import React from 'react';
import { useDrop } from 'react-dnd';

import { Handlers, InternalItem } from '../types';

export type DropDeleteProps = {
  type: string;
  handlers: { current: Handlers };
  deleteProps?: Record<string, any>;
  renderDelayed?: boolean;
  deleteComponent: React.FC<{ ref: React.ReactElement | null }>;
};

const DropDelete = <I extends unknown>({ type, deleteComponent: Delete, handlers, deleteProps, renderDelayed }: DropDeleteProps) => {
  const rootRef = React.useRef(null);
  const [rendered, setRendered] = React.useState(!renderDelayed);

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

  React.useEffect(() => {
    const timeout = renderDelayed ? setTimeout(() => setRendered(true), 100) : undefined;

    return () => clearTimeout(timeout);
  }, []);

  const connectTarget = connectDrop(rootRef);

  return rendered ? <Delete ref={connectTarget} {...deleteProps} /> : null;
};

export default React.memo(DropDelete);

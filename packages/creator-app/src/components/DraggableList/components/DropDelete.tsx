import React from 'react';
import { useDrop } from 'react-dnd';

import { DnDHandlers, DnDItem } from '../types';

export interface DropDeleteProps<I, P> {
  type: string;
  handlers: React.RefObject<DnDHandlers<I>>;
  deleteProps?: P;
  deleteComponent: React.NamedExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<any>>;
}

const DropDelete = <I, P>({ type, handlers, deleteProps, deleteComponent: Delete }: DropDeleteProps<I, P>) => {
  const rootRef = React.useRef(null);

  const [, connectDrop] = useDrop<DnDItem<I>, unknown, unknown>({
    drop: (item, monitor) => {
      item.deleteHovered = false;

      handlers.current?.onDeleteDrop?.(item, monitor);

      return item;
    },
    accept: type,
    hover: (item) => {
      item.deleteHovered = true;
    },
  });

  connectDrop(rootRef);

  return <Delete ref={rootRef} {...(deleteProps as any)} />;
};

export default React.memo(DropDelete) as <I, P>(props: DropDeleteProps<I, P>) => JSX.Element;

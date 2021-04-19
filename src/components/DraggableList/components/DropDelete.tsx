import React from 'react';
import { useDrop } from 'react-dnd';

import { Handlers, InternalItem } from '../types';

export type DropDeleteProps<I, P> = {
  type: string;
  handlers: React.RefObject<Handlers<I>>;
  deleteProps?: P;
  renderDelayed?: boolean;
  deleteComponent: React.NamedExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<any>>;
};

const DropDelete = <I, P>({ type, handlers, deleteProps, renderDelayed, deleteComponent: Delete }: DropDeleteProps<I, P>) => {
  const rootRef = React.useRef(null);
  const [rendered, setRendered] = React.useState(!renderDelayed);

  const [, connectDrop] = useDrop<InternalItem<I>, unknown, unknown>({
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

  React.useEffect(() => {
    const timeout = renderDelayed ? setTimeout(() => setRendered(true), 100) : undefined;

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const connectTarget = connectDrop(rootRef);

  return rendered ? <Delete ref={connectTarget} {...(deleteProps as any)} /> : null;
};

export default React.memo(DropDelete) as <I, P>(props: DropDeleteProps<I, P>) => JSX.Element;

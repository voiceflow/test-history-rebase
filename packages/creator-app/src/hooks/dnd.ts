import React from 'react';
import { ConnectDropTarget, useDrop } from 'react-dnd';

/* This hook doesn't do anything functional,
 * but it prevents the awful lag when dropping steps back onto the step menu
 */
export const useDropLagFix = (accept: string | string[]): ConnectDropTarget => {
  const [, dropRef] = useDrop({ accept });

  React.useEffect(
    () => () => {
      dropRef(null);
    },
    [dropRef]
  );

  return dropRef;
};

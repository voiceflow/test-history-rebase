import React from 'react';
import { ConnectDropTarget, useDrop } from 'react-dnd';

import { DragContext, DragContextPreviewProps } from '@/contexts/DragContext';
import type { PreviewOptions } from '@/contexts/DragContext/DragLayer';
export type { PreviewOptions as DragPreviewOptions } from '@/contexts/DragContext/DragLayer';

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

export const useDragPreview = <P>(
  type: string,
  component: React.FC<DragContextPreviewProps & P>,
  options: PreviewOptions = {}
): void => {
  const { registerPreview } = React.useContext(DragContext)!;

  React.useEffect(() => {
    registerPreview(type, component as React.FC<DragContextPreviewProps & P>, options);

    return () => {
      registerPreview(type, null);
    };
  }, []);
};

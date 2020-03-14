import mouseEventOffset from 'mouse-event-offset';
import React from 'react';

import { CanvasContext } from '@/components/Canvas/contexts';
import { EditPermissionContext, EngineContext, LinkCreationContext, useNode } from '@/pages/Canvas/contexts';
import { swallowEvent } from '@/utils/dom';

// eslint-disable-next-line import/prefer-default-export
export const useLinkTerminal = (portID: string) => {
  const engine = React.useContext(EngineContext)!;
  const canvas = React.useContext(CanvasContext)!;
  const linkCreation = React.useContext(LinkCreationContext)!;
  const editPermission = React.useContext(EditPermissionContext)!;
  const { nodeID } = useNode();

  const onStart = React.useCallback(
    swallowEvent((event: MouseEvent) => {
      const canCreateLink = editPermission.canEdit && !engine.isNodeMovementLocked(nodeID);

      if (canCreateLink) {
        linkCreation.onStart(portID, mouseEventOffset(event, canvas.getRef()));
      }
    }),
    []
  );

  const onEnd = React.useCallback((event) => {
    if (linkCreation.isDrawing) {
      event.stopPropagation();
      linkCreation.onComplete(portID);
    }
  }, []);

  return [onStart, onEnd];
};

import mouseEventOffset from 'mouse-event-offset';
import React from 'react';

import { useEnableDisable } from '@/hooks';
import { EditPermissionContext, EngineContext, useNode } from '@/pages/Canvas/contexts';
import { PortAPI } from '@/pages/Canvas/types';
import { swallowEvent } from '@/utils/dom';

export const useLinkTerminal = (portID: string): Record<'onStart' | 'onEnd', (event: React.MouseEvent) => void> => {
  const engine = React.useContext(EngineContext)!;
  const editPermission = React.useContext(EditPermissionContext);
  const { nodeID } = useNode();

  const onStart = React.useCallback(
    swallowEvent((event: React.MouseEvent) => {
      const canCreateLink = editPermission?.canEdit && !engine.isNodeMovementLocked(nodeID);

      if (canCreateLink) {
        engine.linkCreation.start(portID, mouseEventOffset(event, engine.canvas.getRef()));
      }
    }),
    [editPermission?.canEdit]
  );

  const onEnd = React.useCallback((event) => {
    if (engine.linkCreation?.isDrawing) {
      event.stopPropagation();
      engine.linkCreation.complete(portID);
    }
  }, []);

  return { onStart, onEnd };
};

export const usePortAPI = <T extends HTMLElement>(ref: React.RefObject<T>): [boolean, Required<PortAPI>] => {
  const [isHighlighted, setHighlight, clearHighlight] = useEnableDisable();

  return [
    isHighlighted,
    React.useMemo<Required<PortAPI>>(
      () => ({
        getRect: () => ref.current!.getBoundingClientRect(),
        setHighlight,
        clearHighlight,
      }),
      []
    ),
  ];
};

export const usePortSubscription = (portID: string, api: PortAPI) => {
  const engine = React.useContext(EngineContext)!;

  React.useEffect(() => {
    engine.registerPort(portID, api);

    return () => engine.expirePort(portID, api);
  }, []);
};

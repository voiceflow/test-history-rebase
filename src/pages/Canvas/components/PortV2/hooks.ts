import cuid from 'cuid';
import mouseEventOffset from 'mouse-event-offset';
import React from 'react';

import { useEnableDisable, useTeardown } from '@/hooks';
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

export const usePortAPI = <T extends HTMLElement>(ref: React.RefObject<T>) => {
  const instanceID = React.useMemo(() => cuid(), []);
  const [isHighlighted, setHighlight, clearHighlight] = useEnableDisable();

  return React.useMemo<Required<PortAPI>>(
    () => ({
      instanceID,
      isReady: () => !!ref.current,
      getRect: () => ref.current!.getBoundingClientRect(),
      isHighlighted,
      setHighlight,
      clearHighlight,
    }),
    [isHighlighted]
  );
};

export const usePortSubscription = (portID: string, api: PortAPI) => {
  const engine = React.useContext(EngineContext)!;

  React.useEffect(() => {
    engine.registerPort(portID, api);
  }, [api]);

  useTeardown(() => engine.expirePort(portID, api.instanceID));
};

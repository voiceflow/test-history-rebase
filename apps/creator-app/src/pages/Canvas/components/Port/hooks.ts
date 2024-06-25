import { swallowEvent, usePersistFunction } from '@voiceflow/ui';
import mouseEventOffset from 'mouse-event-offset';
import React from 'react';

import { EngineContext, PortEntityContext } from '@/pages/Canvas/contexts';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';
import { useEditingMode } from '@/pages/Project/hooks';

import type { InternalPortInstance } from './types';

export const usePortInstance = <T extends HTMLElement>() => {
  const ref = React.useRef<T | null>(null);
  const elementInstance = useElementInstance(ref);

  return React.useMemo<InternalPortInstance<T>>(
    () => ({
      ...elementInstance,
      ref,
      getRect: () => ref.current?.getBoundingClientRect() ?? null,
    }),
    [elementInstance]
  );
};

export const useHandlers = ({
  parentActionsPath,
  parentActionsParams,
}: {
  parentActionsPath?: string;
  parentActionsParams?: Record<string, string>;
}) => {
  const engine = React.useContext(EngineContext)!;
  const portEntity = React.useContext(PortEntityContext)!;
  const isEditingMode = useEditingMode();

  const onMouseDown = usePersistFunction(
    swallowEvent((event: React.MouseEvent) => {
      const canvasNode = engine.canvas?.getRef();

      if (!isEditingMode || engine.isCanvasBusy || !engine.canvas || !canvasNode) return;

      engine.linkCreation.start({
        mouseOrigin: mouseEventOffset(event, canvasNode),
        sourcePortID: portEntity.portID,
        parentActionsPath,
        parentActionsParams,
      });
      engine.linkCreation.enableBlockViaLinkMode();
    })
  );

  const onMouseUp = usePersistFunction((event: React.MouseEvent) => {
    if (!engine.linkCreation.isSourcePort(portEntity.portID)) return;

    event.nativeEvent.stopImmediatePropagation();
  });

  return {
    onMouseDown,
    onMouseUp,
  };
};

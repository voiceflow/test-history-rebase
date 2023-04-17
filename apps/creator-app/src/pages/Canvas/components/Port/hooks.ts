import { swallowEvent } from '@voiceflow/ui';
import mouseEventOffset from 'mouse-event-offset';
import React from 'react';

import { EngineContext, PortEntityContext } from '@/pages/Canvas/contexts';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';
import { useEditingMode } from '@/pages/Project/hooks';

import { InternalPortInstance } from './types';

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

export const useHandlers = () => {
  const portEntity = React.useContext(PortEntityContext)!;
  const engine = React.useContext(EngineContext)!;
  const isEditingMode = useEditingMode();

  const onMouseDown = React.useCallback(
    swallowEvent((event: React.MouseEvent) => {
      if (isEditingMode && !engine.isCanvasBusy && engine.canvas) {
        engine.linkCreation.start(portEntity.portID, mouseEventOffset(event, engine.canvas.getRef()));
      }
    }),
    [isEditingMode]
  );

  const onMouseUp = React.useCallback((event: React.MouseEvent) => {
    if (engine.linkCreation.isSourcePort(portEntity.portID)) {
      engine.linkCreation.enableBlockViaLinkMode();
      event.nativeEvent.stopImmediatePropagation();
    }
  }, []);

  return {
    onMouseDown,
    onMouseUp,
  };
};

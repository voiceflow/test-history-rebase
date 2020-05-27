import mouseEventOffset from 'mouse-event-offset';
import React from 'react';

import { EngineContext, PortEntityContext } from '@/pages/Canvas/contexts';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';
import { EditPermissionContext } from '@/pages/Skill/contexts';
import { swallowEvent } from '@/utils/dom';

import { InternalPortInstance } from './types';

export const usePortInstance = <T extends HTMLElement>() => {
  const ref = React.useRef<T | null>(null);
  const elementInstance = useElementInstance(ref);

  return React.useMemo<InternalPortInstance<T>>(
    () => ({
      ...elementInstance,

      ref,
      getRect: () => ref.current!.getBoundingClientRect(),
    }),
    [elementInstance]
  );
};

export const useHandlers = () => {
  const portEntity = React.useContext(PortEntityContext)!;
  const engine = React.useContext(EngineContext)!;
  const editPermission = React.useContext(EditPermissionContext);

  const onMouseDown = React.useCallback(
    swallowEvent((event: React.MouseEvent) => {
      if (editPermission?.canEdit && !engine.isCanvasBusy) {
        engine.linkCreation.start(portEntity.portID, mouseEventOffset(event, engine.canvas!.getRef()));
      }
    }),
    [editPermission?.canEdit]
  );

  const onMouseUp = React.useCallback((event: React.MouseEvent) => {
    if (engine.linkCreation.isSourcePort(portEntity.portID)) {
      event.nativeEvent.stopImmediatePropagation();
    }
  }, []);

  return {
    onMouseDown,
    onMouseUp,
  };
};

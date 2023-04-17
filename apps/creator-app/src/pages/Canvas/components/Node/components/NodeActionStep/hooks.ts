import { Utils } from '@voiceflow/common';
import React from 'react';

import { EngineContext } from '@/pages/Canvas/contexts';
import { NodeInstance } from '@/pages/Canvas/engine/entities/nodeEntity';
import { useElementInstance } from '@/pages/Canvas/engine/entities/utils';
import { StepAPI } from '@/pages/Canvas/types';
import { useEditingMode } from '@/pages/Project/hooks';
import { Coords } from '@/utils/geometry';

export interface InternalNodeInstance extends NodeInstance {
  ref: React.RefObject<HTMLElement>;
}

export interface InternalActionStepAPI<T extends HTMLElement = HTMLElement> extends StepAPI<T> {}

export const useNodeInstance = () => {
  const ref = React.useRef<HTMLElement>(null);
  const engine = React.useContext(EngineContext)!;
  const elementInstance = useElementInstance(ref);

  const getRect = React.useCallback(() => ref.current?.getBoundingClientRect() || null, []);

  return React.useMemo<InternalNodeInstance>(
    () => ({
      ...elementInstance,

      ref,
      rename: Utils.functional.noop,
      getRect,
      getPosition: () => [0, 0],
      getCenterPoint: () => null,
      getThreadAnchorCoords: () => {
        const rect = getRect();

        return rect && new Coords([rect.x, rect.y]).onPlane(engine.canvas!.getPlane());
      },
    }),
    [elementInstance]
  );
};

const wrapElement = (elm: React.ReactElement) => elm;

export const useActionStepAPI = <T extends HTMLElement>(stepRef: React.RefObject<T>, withPorts: boolean) => {
  const isEditingMode = useEditingMode();

  return React.useMemo<InternalActionStepAPI<T>>(
    () => ({
      ref: stepRef,
      withPorts,
      lockOwner: null,
      wrapElement,
      isDraggable: false,

      handlers: {
        onClick: Utils.functional.noop,
        onMouseUp: Utils.functional.noop,
        onDragStart: Utils.functional.noop,
        onMouseEnter: Utils.functional.noop,
        onMouseLeave: Utils.functional.noop,
        onDoubleClick: Utils.functional.noop,
        onContextMenu: Utils.functional.noop,
      },
    }),
    [withPorts, isEditingMode, wrapElement]
  );
};

import { useCreateConst } from '@voiceflow/ui';
import React from 'react';

import { useEnableDisable, useRAF } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { MergeLayerAPI } from '@/pages/Canvas/types';
import MouseMovement from '@/utils/mouseMovement';

export const useMergeLayerAPI = <T extends HTMLElement>(previewRef: React.RefObject<T>) => {
  const engine = React.useContext(EngineContext)!;
  const mouseMovement = useCreateConst(() => new MouseMovement());

  const [isVisible, show, hide] = useEnableDisable();
  const [isTransparent, setTransparent, clearTransparent] = useEnableDisable();

  const pointRef = React.useRef<[number, number]>([0, 0]);
  const offsetRef = React.useRef<[number, number]>([0, 0]);

  const [stylesScheduler] = useRAF();

  const reposition = React.useCallback(() => {
    stylesScheduler(() => {
      const [x, y] = pointRef.current;
      const [offsetX, offsetY] = offsetRef.current;

      if (previewRef.current) {
        // eslint-disable-next-line no-param-reassign
        previewRef.current.style.transform = `translate(${x - offsetX}px, ${y - offsetY}px)`;
      }

      if (engine.merge.sourceNodeID) {
        engine.node.translateAllLinks(engine.merge.sourceNodeID, [0, 0], { sync: true });
      }
    });
  }, []);

  const handleMouseMove = React.useCallback((event: MouseEvent) => {
    mouseMovement.track(event);

    const transformedPoint = engine.getCanvasMousePosition();

    engine.merge.updateCandidates();

    pointRef.current = transformedPoint;
    reposition();
  }, []);

  const initialize = React.useCallback((point: [number, number], offset: [number, number]) => {
    pointRef.current = point;
    offsetRef.current = offset;

    reposition();

    document.addEventListener('mousemove', handleMouseMove);

    show();
  }, []);

  const reset = React.useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);

    hide();
  }, []);

  return React.useMemo<MergeLayerAPI<T>>(
    () => ({
      ref: previewRef,
      reset,
      isVisible,
      initialize,
      isTransparent,
      setTransparent,
      handleMouseMove,
      clearTransparent,
    }),
    [isVisible, isTransparent]
  );
};

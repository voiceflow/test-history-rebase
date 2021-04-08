import React from 'react';

import { useEnableDisable, useRAF } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { MergeLayerAPI } from '@/pages/Canvas/types';
import MouseMovement from '@/utils/mouseMovement';

// eslint-disable-next-line import/prefer-default-export
export const useMergeLayerAPI = <T extends HTMLElement>(previewRef: React.RefObject<T>) => {
  const pointRef = React.useRef<[number, number]>([0, 0]);
  const offsetRef = React.useRef<[number, number]>([0, 0]);

  const [isVisible, show, hide] = useEnableDisable();
  const [isTransparent, setTransparent, clearTransparent] = useEnableDisable();
  const engine = React.useContext(EngineContext)!;
  const mouseMovement = React.useMemo(() => new MouseMovement(), []);
  const [stylesScheduler] = useRAF();

  const resposition = React.useCallback(() => {
    stylesScheduler(() => {
      const [x, y] = pointRef.current;
      const [offsetX, offsetY] = offsetRef.current;

      previewRef.current!.style.transform = `translate(${x - offsetX}px, ${y - offsetY}px)`;

      if (engine.merge.sourceNodeID) {
        engine.node.translateAllLinks(engine.merge.sourceNodeID, [0, 0], { reposition: true });
      }
    });
  }, []);

  const handleMouseMove = React.useCallback((event: MouseEvent) => {
    mouseMovement.track(event);

    const transformedPoint = engine.getCanvasMousePosition();

    engine.merge.updateCandidates();

    pointRef.current = transformedPoint;
    resposition();
  }, []);
  const initialize = React.useCallback((point: [number, number], offset: [number, number]) => {
    pointRef.current = point;
    offsetRef.current = offset;

    resposition();

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
      isVisible,
      isTransparent,
      initialize,
      resposition,
      reset,
      setTransparent,
      clearTransparent,
    }),
    [isVisible, isTransparent]
  );
};

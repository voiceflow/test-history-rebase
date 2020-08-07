import React from 'react';

import { useEnableDisable } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { MergeLayerAPI } from '@/pages/Canvas/types';

// eslint-disable-next-line import/prefer-default-export
export const useMergeLayerAPI = <T extends HTMLElement>(previewRef: React.RefObject<T>) => {
  const offsetRef = React.useRef<[number, number]>([0, 0]);
  const [isVisible, show, hide] = useEnableDisable();
  const [isTransparent, setTransparent, clearTransparent] = useEnableDisable();
  const engine = React.useContext(EngineContext)!;

  const resposition = React.useCallback(([x, y]: [number, number]) => {
    const previewEl = previewRef.current!;
    const [offsetX, offsetY] = offsetRef.current;

    window.requestAnimationFrame(() => {
      previewEl.style.transform = `translate(${x - offsetX}px, ${y - offsetY}px)`;

      engine.node.redrawLinks(engine.merge.sourceNodeID!);
    });
  }, []);
  const handleMouseMove = React.useCallback(() => {
    const transformedPoint = engine.getCanvasMousePosition();

    engine.merge.updateCandidates();

    resposition(transformedPoint);
  }, []);
  const initialize = React.useCallback((point: [number, number], offset: [number, number]) => {
    offsetRef.current = offset;
    resposition(point);

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

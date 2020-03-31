import React from 'react';

import { useEnableDisable, useTeardown } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { MergeLayerAPI } from '@/pages/Canvas/types';

export const useMergeLayerAPI = <T extends HTMLElement>(previewRef: React.RefObject<T>) => {
  const offsetRef = React.useRef<[number, number]>([0, 0]);
  const [isVisible, show, hide] = useEnableDisable();
  const engine = React.useContext(EngineContext)!;

  const resposition = React.useCallback(([x, y]: [number, number]) => {
    const previewEl = previewRef.current!;
    const [offsetX, offsetY] = offsetRef.current;

    window.requestAnimationFrame(() => {
      previewEl.style.transform = `translate3d(${x - offsetX}px, ${y - offsetY}px, 0) rotate(-5deg)`;
    });
  }, []);
  const handleMouseMove = React.useCallback(() => {
    const transformedPoint = engine.getCanvasMousePosition();

    engine.mergeV2.updateCandidates();

    return resposition(transformedPoint);
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
      initialize,
      resposition,
      reset,
    }),
    [isVisible]
  );
};

export const useMergeLayerSubscription = (api: MergeLayerAPI) => {
  const engine = React.useContext(EngineContext)!;

  React.useEffect(() => engine.mergeV2.registerMergeLayer(api), [api]);

  useTeardown(() => engine.mergeV2.registerMergeLayer(null));
};

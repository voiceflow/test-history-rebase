import React from 'react';

import { EngineContext } from '@/pages/Canvas/contexts';
import { useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks';
import { Pair } from '@/types';

import { OverlayState } from '../../types';

const useCanvasInteractions = (onPan: (movement: Pair<number>) => void, { ref, position, size, zoom }: OverlayState) => {
  const engine = React.useContext(EngineContext)!;

  useCanvasPan(onPan, [onPan]);

  useCanvasZoom((calculateMovement) => {
    if (!position.current) return;

    const el = ref.current!;
    const [x, y] = position.current!;
    const [width, height] = size.current!;
    const [moveX, moveY, zoomDiffFactor] = calculateMovement(engine.canvas!.mapPoint([x, y]));
    const nextX = x + moveX;
    const nextY = y + moveY;
    const nextZoom = zoom.current * zoomDiffFactor;

    position.current = [nextX, nextY];
    zoom.current = nextZoom;

    window.requestAnimationFrame(() => {
      el.style.left = `${nextX}px`;
      el.style.top = `${nextY}px`;
      el.style.width = `${width * nextZoom}px`;
      el.style.height = `${height * nextZoom}px`;
    });
  });
};

export default useCanvasInteractions;

import React from 'react';

import { useRAF } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks';
import { Pair } from '@/types';

import { OverlayState } from '../../types';

const useCanvasInteractions = (onPan: (movement: Pair<number>) => void, { ref, position, size, zoom }: OverlayState) => {
  const engine = React.useContext(EngineContext)!;

  const [stylesScheduler] = useRAF();

  useCanvasPan(onPan, [onPan]);

  useCanvasZoom((calculateMovement) => {
    if (!position.current) return;

    const el = ref.current!;
    const [x, y] = position.current!;
    const [moveX, moveY, zoomDiffFactor] = calculateMovement(engine.canvas!.mapPoint([x, y]));
    const nextX = x + moveX;
    const nextY = y + moveY;
    const nextZoom = zoom.current * zoomDiffFactor;

    position.current = [nextX, nextY];
    zoom.current = nextZoom;

    stylesScheduler(() => {
      el.style.left = `${position.current![0]}px`;
      el.style.top = `${position.current![1]}px`;
      el.style.width = `${size.current![0] * zoom.current}px`;
      el.style.height = `${size.current![1] * zoom.current}px`;
    });
  });
};

export default useCanvasInteractions;

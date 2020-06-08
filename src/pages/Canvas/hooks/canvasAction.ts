import React from 'react';

import { MovementCalculator } from '@/components/Canvas/types';
import { CanvasAction } from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Pair } from '@/types';

export const useCanvasIdle = (onIdle: () => void, deps: any[] = []) => {
  const engine = React.useContext(EngineContext)!;

  React.useEffect(() => {
    engine.emitter.on(CanvasAction.IDLE, onIdle);

    return () => {
      engine.emitter.off(CanvasAction.IDLE, onIdle);
    };
  }, deps);
};

export const useCanvasPan = (onPan: (movement: Pair<number>) => void, deps: any[] = []) => {
  const engine = React.useContext(EngineContext)!;

  React.useEffect(() => {
    engine.emitter.on(CanvasAction.PAN, onPan);

    return () => {
      engine.emitter.off(CanvasAction.PAN, onPan);
    };
  }, deps);
};

export const useCanvasZoom = (onZoom: (calulateMovement: MovementCalculator) => void, deps: any[] = []) => {
  const engine = React.useContext(EngineContext)!;

  React.useEffect(() => {
    engine.emitter.on(CanvasAction.ZOOM, onZoom);

    return () => {
      engine.emitter.off(CanvasAction.ZOOM, onZoom);
    };
  }, deps);
};

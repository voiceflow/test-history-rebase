import React from 'react';

import { MovementCalculator } from '@/components/Canvas/types';
import { CanvasAction } from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Pair } from '@/types';
import { Coords } from '@/utils/geometry';

export const useCanvasIdle = (onIdle: () => void, dependencies: any[] = []) => {
  const engine = React.useContext(EngineContext)!;

  React.useEffect(() => {
    engine.emitter.on(CanvasAction.IDLE, onIdle);

    return () => {
      engine.emitter.off(CanvasAction.IDLE, onIdle);
    };
  }, dependencies);
};

export const useCanvasPan = (onPan: (movement: Pair<number>) => void, dependencies: any[] = []) => {
  const engine = React.useContext(EngineContext)!;

  React.useEffect(() => {
    engine.emitter.on(CanvasAction.PAN, onPan);

    return () => {
      engine.emitter.off(CanvasAction.PAN, onPan);
    };
  }, dependencies);
};

export const useCanvasZoom = (onZoom: (calulateMovement: MovementCalculator) => void, dependencies: any[] = []) => {
  const engine = React.useContext(EngineContext)!;

  React.useEffect(() => {
    engine.emitter.on(CanvasAction.ZOOM, onZoom);

    return () => {
      engine.emitter.off(CanvasAction.ZOOM, onZoom);
    };
  }, dependencies);
};

export const useCanvasMouse = (onMove: (point: Coords) => void, dependencies: any[] = []) => {
  const engine = React.useContext(EngineContext)!;

  React.useEffect(() => {
    engine.emitter.on(CanvasAction.MOVE_MOUSE, onMove);

    return () => {
      engine.emitter.off(CanvasAction.MOVE_MOUSE, onMove);
    };
  }, dependencies);
};

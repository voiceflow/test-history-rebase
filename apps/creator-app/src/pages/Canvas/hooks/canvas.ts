import React from 'react';

import { MovementCalculator } from '@/components/Canvas/types';
import { useTeardown } from '@/hooks';
import { CanvasAction } from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Pair } from '@/types';
import { Coords } from '@/utils/geometry';

export const useCanvasRendered = () => {
  const engine = React.useContext(EngineContext)!;
  const [isRendered, setRendered] = React.useState(!!engine.canvas);
  const renderHandler = React.useCallback(() => setRendered(true), []);

  const initialRender = React.useRef(false);

  if (!initialRender.current && !isRendered) {
    engine.emitter.once(CanvasAction.RENDERED, renderHandler);
  }

  initialRender.current = true;

  useTeardown(() => {
    engine.emitter.off(CanvasAction.RENDERED, renderHandler);
  });

  return isRendered;
};

const createUseCanvasAction =
  <Args extends any[] = []>(action: CanvasAction) =>
  (onAction: (...args: Args) => void, dependencies: any[] = []) => {
    const engine = React.useContext(EngineContext)!;

    React.useEffect(() => {
      engine.emitter.on(action, onAction as (...args: any[]) => void);

      return () => {
        engine.emitter.off(action, onAction as (...args: any[]) => void);
      };
    }, dependencies);
  };

export const useCanvasPan = createUseCanvasAction<[movement: Pair<number>]>(CanvasAction.PAN);
export const useCanvasIdle = createUseCanvasAction(CanvasAction.IDLE);
export const useCanvasZoom = createUseCanvasAction<[calulateMovement: MovementCalculator]>(CanvasAction.ZOOM);
export const useCanvasMouse = createUseCanvasAction<[point: Coords]>(CanvasAction.MOVE_MOUSE);
export const useCanvasPanApplied = createUseCanvasAction<[movement: Pair<number>]>(CanvasAction.PAN_APPLIED);
export const useCanvasZoomApplied = createUseCanvasAction<[calulateMovement: MovementCalculator]>(CanvasAction.ZOOM_APPLIED);

export const useCanvasZoomLifecycle = (onZoomStart: () => void, onZoom: (calculateMovement: MovementCalculator) => void, onZoomEnd: () => void) => {
  const zoomingRef = React.useRef(false);

  useCanvasZoom(
    (calculateMovement) => {
      if (!zoomingRef.current) {
        zoomingRef.current = true;
        onZoomStart();
      }
      onZoom(calculateMovement);
    },
    [onZoomStart]
  );

  useCanvasIdle(() => {
    if (zoomingRef.current) {
      onZoomEnd();
    }
    zoomingRef.current = false;
  }, [onZoomEnd]);
};

import React from 'react';

import { MovementCalculator } from '@/components/Canvas/types';
import { REALTIME_CURSOR_ENABLED } from '@/config';
import * as Realtime from '@/ducks/realtime';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Pair, Viewport } from '@/types';

// eslint-disable-next-line import/prefer-default-export
export const useCursorControls = () => {
  const mousePosition = React.useRef<[number, number] | null>(null);
  const engine = React.useContext(EngineContext)!;

  const moveMouse = React.useCallback((location) => {
    if (!REALTIME_CURSOR_ENABLED) return;

    engine.realtime.sendVolatileUpdate(Realtime.moveMouse(location));
  }, []);

  const panViewport = React.useCallback(
    (movement: Pair<number>) => {
      engine.panViewport(movement);

      if (mousePosition.current !== null && engine.canvas!.isTrackpadPanning()) {
        const zoom = engine.canvas!.getZoom();
        const [moveX, moveY] = movement;
        const [currX, currY] = mousePosition.current;
        const nextMousePosition: [number, number] = [currX - moveX / zoom, currY - moveY / zoom];

        if (engine.linkCreation.isDrawing) {
          const transformedPosition = engine.canvas!.reverseTransformPoint(nextMousePosition, true);
          const sourcePortID = engine.linkCreation.sourcePortID!;

          engine.linkCreation.abort();
          engine.linkCreation.start(sourcePortID, transformedPosition);
        }

        mousePosition.current = nextMousePosition;
        moveMouse(nextMousePosition);
      }
    },
    [moveMouse]
  );

  const zoomViewport = React.useCallback((calculateMovement: MovementCalculator) => engine.zoomViewport(calculateMovement), []);

  const updateViewport = React.useCallback(({ x, y, zoom }: Viewport) => engine.updateViewport(x, y, zoom), []);

  React.useEffect(() => {
    if (engine.canvas) {
      const onMouseMove = () => {
        if (!engine.canvas!.isPanning()) {
          try {
            const transformedPoint = engine.getCanvasMousePosition();

            mousePosition.current = transformedPoint;

            moveMouse(transformedPoint);
          } catch {
            // user switched to a different window
          }
        }
      };

      document.addEventListener('mousemove', onMouseMove);

      return () => document.removeEventListener('mousemove', onMouseMove);
    }

    return undefined;
  }, [moveMouse]);

  return {
    updateViewport,
    panViewport,
    zoomViewport,
  };
};

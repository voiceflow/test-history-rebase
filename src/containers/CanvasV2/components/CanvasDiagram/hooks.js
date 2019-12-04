import mouseEventOffset from 'mouse-event-offset';
import React from 'react';

import { DEBUG_REALTIME } from '@/config';
import { EngineContext } from '@/containers/CanvasV2/contexts';
import * as Realtime from '@/ducks/realtime';

// eslint-disable-next-line import/prefer-default-export
export const useCursorControls = () => {
  const mousePosition = React.useRef(null);
  const engine = React.useContext(EngineContext);

  const moveMouse = React.useCallback((location) => {
    if (DEBUG_REALTIME) return;

    engine.realtime.sendVolatileUpdate(Realtime.moveMouse(location));
  }, []);

  const panViewport = React.useCallback((moveX, moveY) => {
    engine.realtime.panViewport(moveX, moveY);

    if (mousePosition.current !== null && engine.canvas.isTrackpadPanning()) {
      const zoom = engine.canvas.getZoom();
      const [currX, currY] = mousePosition.current;
      const nextMousePosition = [currX - moveX / zoom, currY - moveY / zoom];

      mousePosition.current = nextMousePosition;

      moveMouse(nextMousePosition);
    }
  }, []);

  const zoomViewport = React.useCallback((calculateMovement) => engine.realtime.zoomViewport(calculateMovement), []);

  const updateViewport = React.useCallback(({ x, y, zoom }) => engine.updateViewport(x, y, zoom), []);

  React.useEffect(() => {
    if (engine.canvas) {
      const onMouseMove = (event) => {
        if (!engine.canvas.isPanning()) {
          const transformedPoint = engine.canvas.transformPoint(mouseEventOffset(event, engine.canvas.getRef()), true);

          mousePosition.current = transformedPoint;

          moveMouse(transformedPoint);
        }
      };

      document.addEventListener('mousemove', onMouseMove);

      return () => document.removeEventListener('mousemove', onMouseMove);
    }
  }, [engine.canvas]);

  return {
    updateViewport,
    panViewport,
    zoomViewport,
  };
};

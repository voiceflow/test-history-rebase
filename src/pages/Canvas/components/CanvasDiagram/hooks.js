import mouseEventOffset from 'mouse-event-offset';
import React from 'react';

import { DEBUG_REALTIME } from '@/config';
import * as Realtime from '@/ducks/realtime';
import { EngineContext, LinkCreationContext } from '@/pages/Canvas/contexts';

// eslint-disable-next-line import/prefer-default-export
export const useCursorControls = () => {
  const mousePosition = React.useRef(null);
  const engine = React.useContext(EngineContext);
  const linkCreation = React.useContext(LinkCreationContext);
  const moveMouse = React.useCallback(
    (location) => {
      if (DEBUG_REALTIME) return;

      engine.realtime.sendVolatileUpdate(Realtime.moveMouse(location));
    },
    [engine.realtime]
  );

  const panViewport = React.useCallback(
    (moveX, moveY) => {
      engine.realtime.panViewport(moveX, moveY);

      if (mousePosition.current !== null && engine.canvas.isTrackpadPanning()) {
        const zoom = engine.canvas.getZoom();
        const [currX, currY] = mousePosition.current;
        const nextMousePosition = [currX - moveX / zoom, currY - moveY / zoom];

        if (linkCreation.isDrawing) {
          const transformedPosition = engine.canvas.reverseTransformPoint(nextMousePosition, true);

          linkCreation.onAbort();
          linkCreation.onStart(linkCreation.sourcePortID, transformedPosition);
        }
        mousePosition.current = nextMousePosition;
        moveMouse(nextMousePosition);
      }
    },
    [engine, linkCreation, moveMouse]
  );

  const zoomViewport = React.useCallback(
    (calculateMovement) => {
      engine.realtime.zoomViewport(calculateMovement);
    },
    [engine.realtime]
  );

  const updateViewport = React.useCallback(({ x, y, zoom }) => engine.updateViewport(x, y, zoom), [engine]);

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
  }, [engine.canvas, moveMouse]);

  return {
    updateViewport,
    panViewport,
    zoomViewport,
  };
};

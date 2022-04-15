import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { throttle } from 'throttle-debounce';

import { MovementCalculator } from '@/components/Canvas/types';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as RealtimeDuck from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import { useFeature, useSelector, useSyncDispatch } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Pair, Point, Viewport } from '@/types';

export const useCursorControls = () => {
  const mousePosition = React.useRef<Point | null>(null);
  const engine = React.useContext(EngineContext)!;
  const atomicActionsAwareness = useFeature(FeatureFlag.ATOMIC_ACTIONS_AWARENESS);
  const creatorID = useSelector(Account.userIDSelector)!;
  const diagramID = useSelector(Session.activeDiagramIDSelector)!;
  const awarenessMoveCursor = useSyncDispatch(Realtime.diagram.awareness.moveCursor);
  const hasDiagramViewers = useSelector(DiagramV2.hasExternalDiagramViewersByIDSelector, { id: diagramID });
  const prevCoords = React.useRef<Point | null>(null);

  const moveMouse = React.useCallback(
    throttle(10, (nextCoords: Point) => {
      if (atomicActionsAwareness.isEnabled) {
        if (hasDiagramViewers && prevCoords.current !== nextCoords) {
          prevCoords.current = nextCoords;
          awarenessMoveCursor({ ...engine.context, creatorID, coords: nextCoords });
        }
      } else {
        engine.realtime.sendVolatileUpdate(RealtimeDuck.moveMouse(nextCoords));
      }
    }),
    [hasDiagramViewers]
  );

  const panViewport = React.useCallback(
    (movement: Pair<number>) => {
      engine.panViewport(movement);

      if (!engine.canvas) return;

      if (mousePosition.current !== null && engine.canvas.isPanning()) {
        const zoom = engine.canvas.getZoom();
        const [moveX, moveY] = movement;
        const [currX, currY] = mousePosition.current;
        const nextMousePosition: [number, number] = [currX - moveX / zoom, currY - moveY / zoom];

        if (engine.linkCreation.isDrawing) {
          const transformedPosition = engine.canvas.reverseTransformPoint(nextMousePosition, true);
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

  const updateViewport = React.useCallback(({ x, y, zoom }: Viewport) => engine.updateViewport(diagramID, x, y, zoom), [diagramID]);

  React.useEffect(() => {
    const onMouseMove = () => {
      if (engine.canvas && !engine.canvas.isPanning()) {
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
  }, [moveMouse]);

  return {
    updateViewport,
    panViewport,
    zoomViewport,
  };
};

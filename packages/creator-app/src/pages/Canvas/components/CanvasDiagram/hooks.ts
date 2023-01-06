import { TippyTooltip, useThrottledCallback } from '@voiceflow/ui';
import React from 'react';

import { MovementCalculator } from '@/components/Canvas/types';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Session from '@/ducks/session';
import { useRAF, useSelector } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Pair, Point, Viewport } from '@/types';

export const useCursorControls = () => {
  const engine = React.useContext(EngineContext)!;

  const diagramID = useSelector(Session.activeDiagramIDSelector)!;
  const hasDiagramViewers = useSelector(DiagramV2.hasExternalDiagramViewersByIDSelector, { id: diagramID });

  const prevCoords = React.useRef<Point | null>(null);
  const mousePosition = React.useRef<Point | null>(null);

  const [scheduler] = useRAF();

  const moveMouse = useThrottledCallback(
    10,
    (nextCoords: Point) => {
      if (hasDiagramViewers && prevCoords.current !== nextCoords) {
        prevCoords.current = nextCoords;
        engine.io.cursorMove(nextCoords);
      }
    },
    [hasDiagramViewers]
  );

  const panViewport = React.useCallback(
    (movement: Pair<number>) => {
      TippyTooltip.closeAll();

      engine.panViewport(movement);

      if (!engine.canvas) return;

      if (mousePosition.current !== null && engine.canvas.isPanning()) {
        const zoom = engine.canvas.getZoom();
        const [moveX, moveY] = movement;
        const [currX, currY] = mousePosition.current;
        const nextMousePosition: [number, number] = [currX - moveX / zoom, currY - moveY / zoom];

        mousePosition.current = nextMousePosition;
        moveMouse(nextMousePosition);

        if (engine.linkCreation.isDrawing) {
          scheduler(() => engine.linkCreation.redrawNewLink());
        }
      }
    },
    [moveMouse]
  );

  const zoomViewport = React.useCallback((calculateMovement: MovementCalculator) => {
    TippyTooltip.closeAll();
    engine.zoomViewport(calculateMovement);
  }, []);

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

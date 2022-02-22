import { Utils } from '@voiceflow/common';
import React from 'react';
import { useDispatch } from 'react-redux';

import { BlockType } from '@/constants';
import { AutoPanningCacheContext } from '@/contexts';
import * as Realtime from '@/ducks/realtime';
import { useRAF } from '@/hooks';
import { buildPath, getMarkerAttrs, getPathPoints, getVirtualPoints } from '@/pages/Canvas/components/Link';
import { EngineContext } from '@/pages/Canvas/contexts';
import { NewLinkAPI } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';

type NewLinkInstance<T extends SVGElement> = NewLinkAPI & {
  ref: React.RefObject<T>;
  markerRef: React.RefObject<SVGMarkerElement>;
  getSourceTargetPoints: () => Pair<Point> | null;
  isVisible: boolean;
};

// eslint-disable-next-line import/prefer-default-export
export const useNewLinkAPI = <T extends SVGElement>() => {
  const ref = React.useRef<T>(null);
  const markerRef = React.useRef<SVGMarkerElement>(null);
  const dispatch = useDispatch();
  const points = React.useRef<Pair<Point> | null>(null);
  const isPinned = React.useRef(false);
  const removeEventListeners = React.useRef(Utils.functional.noop);
  const engine = React.useContext(EngineContext)!;
  const isAutoPanning = React.useContext(AutoPanningCacheContext);
  const [isVisible, setVisible] = React.useState(false);

  const [mouseMoveStylesScheduler] = useRAF();
  const [pinStylesScheduler] = useRAF();

  const moveLink = React.useCallback(
    (...args: Parameters<typeof Realtime['moveLink']>) => dispatch(Realtime.sendRealtimeVolatileUpdate(Realtime.moveLink(...args))),
    []
  );

  React.useEffect(() => {
    // eslint-disable-next-line xss/no-mixed-html
    engine.linkCreation.setElements(ref, markerRef);

    return () => {
      engine.linkCreation.setElements(null, null);
    };
  }, []);

  const onMouseMove = React.useCallback(() => {
    if (isPinned.current || isAutoPanning.current) return;

    const [endX, endY] = engine.getCanvasMousePosition();

    const [start] = points.current!;

    const nextPoints: Pair<Point> = [start, [endX, endY]];
    const virtualPoints = getVirtualPoints(nextPoints)!;

    points.current = nextPoints;
    moveLink({ points: virtualPoints });

    mouseMoveStylesScheduler(() => {
      engine.linkCreation.redrawNewLink();
    });
  }, [buildPath]);

  const onMouseUp = React.useCallback((event: MouseEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    if (engine.linkCreation.activeTargetPortID) {
      engine.linkCreation.complete(engine.linkCreation.activeTargetPortID);
    } else if (!engine.linkCreation.isCompleting) {
      engine.linkCreation.abort();
    }

    event.preventDefault();
  }, []);

  return React.useMemo<NewLinkInstance<T>>(
    () => ({
      ref,
      markerRef,
      isVisible,
      isPinned: () => isPinned.current,
      getSourceTargetPoints: () => points.current,
      show: () => {
        const nextPoints = engine.linkCreation.getLinkPoints();

        if (!nextPoints) return;

        points.current = nextPoints;
        moveLink({ points: getVirtualPoints(points.current)! });

        setVisible(true);

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        removeEventListeners.current = () => {
          document.removeEventListener('mouseup', onMouseUp);
          document.removeEventListener('mousemove', onMouseMove);
        };
      },
      hide: () => {
        removeEventListeners.current();
        moveLink({ reset: true });
        setVisible(false);
      },
      pin: (position) => {
        isPinned.current = true;

        const [start] = points.current!;
        const nextPoints: Pair<Point> = [start, position];
        const virtualPoints = getVirtualPoints(nextPoints)!;
        const straight = engine.isStraightLinks();
        const targetPort = engine.linkCreation.activeTargetPortID ? engine.getPortByID(engine.linkCreation.activeTargetPortID) : null;
        const sourcePort = engine.linkCreation.sourcePortID ? engine.getPortByID(engine.linkCreation.sourcePortID) : null;
        const targetNode = engine.getNodeByID(targetPort?.nodeID);
        const sourceNode = engine.getNodeByID(sourcePort?.nodeID);
        const targetIsBlock = targetNode?.type === BlockType.COMBINED;

        points.current = nextPoints;
        moveLink({ points: virtualPoints });

        const linkEl = ref.current!;
        const markerEl = markerRef.current!;

        const getSourceBlockEndY = () => {
          const nodeAPI = sourceNode ? engine.node.api(sourceNode.parentNode ?? sourceNode.id) : null;
          const height = nodeAPI?.instance?.getRect()?.height;
          const sourceNodePosition = nodeAPI?.instance?.getPosition() ?? null;

          if (height && sourceNodePosition) {
            return sourceNodePosition[1] + height / engine.canvas!.getZoom();
          }

          return null;
        };

        pinStylesScheduler(() => {
          const pathPoints = getPathPoints(virtualPoints, { straight, connected: true, targetIsBlock, sourceBlockEndY: getSourceBlockEndY() });

          const path = buildPath(pathPoints, straight);
          const marketAttrs = getMarkerAttrs(pathPoints, straight);

          linkEl.setAttribute('d', path);
          Object.keys(marketAttrs).forEach((attr) => markerEl.setAttribute(attr, marketAttrs[attr as keyof typeof marketAttrs]));

          engine.portLinkInstances.get(engine.linkCreation.sourcePortID!)?.api.updatePosition(pathPoints);
        });
      },
      unpin: () => {
        isPinned.current = false;
      },
    }),
    [isVisible, onMouseMove, onMouseUp, moveLink]
  );
};

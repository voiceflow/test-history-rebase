import React from 'react';
import { useDispatch } from 'react-redux';

import { BlockType } from '@/constants';
import * as Realtime from '@/ducks/realtime';
import { buildPath, getMarkerAttrs, getVirtualPoints } from '@/pages/Canvas/components/Link';
import { EngineContext } from '@/pages/Canvas/contexts';
import { NewLinkAPI } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';
import { noop } from '@/utils/functional';

type NewLinkInstance<T extends SVGElement> = NewLinkAPI & {
  ref: React.RefObject<T>;
  markerRef: React.RefObject<SVGMarkerElement>;
  getPoints: () => Pair<Point> | null;
  isVisible: boolean;
};

// eslint-disable-next-line import/prefer-default-export
export const useNewLinkAPI = <T extends SVGElement>() => {
  const ref = React.useRef<T>(null);
  const markerRef = React.useRef<SVGMarkerElement>(null);
  const dispatch = useDispatch();
  const points = React.useRef<Pair<Point> | null>(null);
  const isPinned = React.useRef(false);
  const removeEventListeners = React.useRef(noop);
  const engine = React.useContext(EngineContext)!;
  const [isVisible, setVisible] = React.useState(false);

  const moveLink = React.useCallback(
    (...args: Parameters<typeof Realtime['moveLink']>) => dispatch(Realtime.sendRealtimeVolatileUpdate(Realtime.moveLink(...args))),
    []
  );

  const onMouseMove = React.useCallback(() => {
    if (isPinned.current) return;

    const [endX, endY] = engine.getCanvasMousePosition();

    const [start] = points.current!;

    const nextPoints: Pair<Point> = [start, [endX, endY]];
    const virtualPoints = getVirtualPoints(nextPoints)!;

    points.current = nextPoints;
    moveLink({ points: virtualPoints });

    const linkEl = ref.current!;
    const markerEl = markerRef.current!;

    window.requestAnimationFrame(() => {
      const straight = engine.isStraightLinks();
      const marketAttrs = getMarkerAttrs(virtualPoints, { straight, unconnected: true });

      linkEl.setAttribute('d', buildPath(virtualPoints, { straight, unconnected: true }));

      Object.keys(marketAttrs).forEach((attr) => markerEl.setAttribute(attr, marketAttrs[attr as keyof typeof marketAttrs]));

      engine.portLinkInstances.get(engine.linkCreation.sourcePortID!)?.api.updatePosition(virtualPoints);
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
      getPoints: () => points.current,
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
        const targetNode = targetPort ? engine.getNodeByID(targetPort.nodeID) : null;
        const sourceNode = sourcePort ? engine.getNodeByID(sourcePort.nodeID) : null;
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

        window.requestAnimationFrame(() => {
          const path = buildPath(virtualPoints, {
            straight,
            targetIsBlock,
            sourceBlockEndY: getSourceBlockEndY(),
          });
          const marketAttrs = getMarkerAttrs(virtualPoints, { straight, targetIsBlock });

          linkEl.setAttribute('d', path);
          Object.keys(marketAttrs).forEach((attr) => markerEl.setAttribute(attr, marketAttrs[attr as keyof typeof marketAttrs]));

          engine.portLinkInstances.get(engine.linkCreation.sourcePortID!)?.api.updatePosition(virtualPoints);
        });
      },
      unpin: () => {
        isPinned.current = false;
      },
    }),
    [isVisible, onMouseMove, onMouseUp, moveLink]
  );
};

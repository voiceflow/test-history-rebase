import React from 'react';
import { useDispatch } from 'react-redux';

import * as Realtime from '@/ducks/realtime';
import { buildPath } from '@/pages/Canvas/components/Link/utils';
import { LINK_WIDTH } from '@/pages/Canvas/components/Port/constants';
import { EngineContext } from '@/pages/Canvas/contexts';
import { NewLinkAPI } from '@/pages/Canvas/engine/linkCreationEngine';
import { Pair, Point } from '@/types';
import { noop } from '@/utils/functional';

type NewLinkInstance<T extends SVGElement> = NewLinkAPI & {
  ref: React.RefObject<T>;
  removeEventListeners: React.RefObject<() => void>;
  getPoints: () => Pair<Point> | null;
  isVisible: boolean;
};

export const getVirtualPoints: {
  (points: Pair<Point>): Pair<Point>;
  (points: null): null;
} = (points: any) => {
  if (!points) {
    return points;
  }

  const [[x1, y1], [x2, y2]] = points as Pair<Point>;

  return [
    [x1 + LINK_WIDTH, y1],
    [x2, y2],
  ];
};

// eslint-disable-next-line import/prefer-default-export
export const useNewLinkAPI = <T extends SVGElement>() => {
  const ref = React.useRef<T>(null);
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

    window.requestAnimationFrame(() => linkEl.setAttribute('d', buildPath(virtualPoints)));
  }, []);

  const onMouseUp = React.useCallback((event) => {
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
      removeEventListeners,
      isVisible,
      isPinned: () => isPinned.current,
      getPoints: () => points.current,
      show: () => {
        const nextPoints = engine.linkCreation.getLinkPoints();

        if (!nextPoints) return;

        points.current = nextPoints;
        moveLink({ points: getVirtualPoints(points.current) });

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

        points.current = nextPoints;
        moveLink({ points: virtualPoints });

        const linkEl = ref.current!;

        window.requestAnimationFrame(() => linkEl.setAttribute('d', buildPath(virtualPoints)));
      },
      unpin: () => {
        isPinned.current = false;
      },
    }),
    [isVisible, onMouseMove, onMouseUp, moveLink]
  );
};

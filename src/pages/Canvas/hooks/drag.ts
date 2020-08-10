import React from 'react';

import { useTeardown } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Pair, Point } from '@/types';
import { noop } from '@/utils/functional';
import { Coords, Vector } from '@/utils/geometry';
import MouseMovement from '@/utils/mouseMovement';

const updateTransform = <T extends HTMLElement>(ref: React.RefObject<T | null>, [x, y]: Point) => {
  const targetEl = ref.current!;

  window.requestAnimationFrame(() => {
    targetEl.style.transform = `translate(${x}px, ${y}px)`;
  });
};

export const useDragTranslate = <T extends HTMLElement>(ref: React.RefObject<T | null>, position: React.MutableRefObject<Point>) =>
  React.useCallback(([movementX, movementY]: Pair<number>) => {
    const [posX, posY] = position.current!;
    const nextPosition: Point = [posX + movementX, posY + movementY];
    position.current = nextPosition;

    updateTransform(ref, nextPosition);
  }, []);

export const useVectorDragTranslate = <T extends HTMLElement>(ref: React.RefObject<T | null>, coords: React.MutableRefObject<Coords>) =>
  React.useCallback((movement: Vector) => {
    const nextCoords = coords.current.add(movement);
    coords.current = nextCoords;

    updateTransform(ref, nextCoords.point);

    return nextCoords;
  }, []);

export const useEntityDrag = (
  {
    skipDrag,
    drag,
    drop,
  }: {
    skipDrag?: () => boolean;
    drag?: (movement: Pair<number>) => Promise<void> | void;
    drop?: () => Promise<void> | void;
  } = {},
  dependencies: any[] = []
) => {
  const engine = React.useContext(EngineContext)!;

  const teardownMouseListeners = React.useRef(noop);
  const mouseMovement = React.useMemo(() => new MouseMovement(), []);

  const onDrag = React.useCallback(async (event: MouseEvent) => {
    mouseMovement.track(event);

    const [movementX, movementY] = mouseMovement.getBoundedMovement();

    const zoom = engine.canvas!.getZoom();

    await drag?.([movementX / zoom, movementY / zoom]);
  }, dependencies);

  const addMouseListeners = React.useCallback(() => {
    document.addEventListener('mousemove', onDrag);

    teardownMouseListeners.current = () => {
      mouseMovement.clear();

      document.removeEventListener('mousemove', onDrag);
    };
  }, dependencies);

  const onDragStart = React.useCallback(
    (dragEvent: React.DragEvent) => {
      if (dragEvent.defaultPrevented || skipDrag?.()) return;

      dragEvent.preventDefault();

      addMouseListeners();

      document.addEventListener(
        'mouseup',
        async (event) => {
          event.preventDefault();

          teardownMouseListeners.current();

          await drop?.();
        },
        { once: true }
      );
    },
    [...dependencies, addMouseListeners]
  );

  useTeardown(() => teardownMouseListeners.current());

  return onDragStart;
};

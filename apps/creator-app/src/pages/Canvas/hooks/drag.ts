/* eslint-disable no-param-reassign */

import { Utils } from '@voiceflow/common';
import React from 'react';

import { useRAF, useTeardown } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Pair, Point } from '@/types';
import { Coords, Vector } from '@/utils/geometry';
import MouseMovement from '@/utils/mouseMovement';

export const useDragTranslate = <T extends HTMLElement>(ref: React.RefObject<T | null>, position: React.MutableRefObject<Point>) => {
  const [stylesScheduler] = useRAF();

  return React.useCallback(([movementX, movementY]: Pair<number>) => {
    if (!position.current) return;

    const [posX, posY] = position.current;

    position.current = [posX + movementX, posY + movementY];

    stylesScheduler(() => {
      if (!position.current || !ref.current) return;

      ref.current.style.transform = `translate(${position.current[0]}px, ${position.current[1]}px)`;
    });
  }, []);
};

export const useVectorDragTranslate = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  coords: React.MutableRefObject<Coords>
): [(movement: Vector) => Coords, (coords: Coords) => void] => {
  const [stylesScheduler] = useRAF();

  const update = React.useCallback((nextCoords: Coords) => {
    coords.current = nextCoords;

    stylesScheduler(() => {
      if (!ref.current) return;

      ref.current.style.transform = `translate(${coords.current.point[0]}px, ${coords.current.point[1]}px)`;
    });
  }, []);

  const translate = React.useCallback((movement: Vector) => {
    const nextCoords = coords.current.add(movement);

    update(nextCoords);

    return nextCoords;
  }, []);

  return [translate, update];
};

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

  const teardownMouseListeners = React.useRef(Utils.functional.noop);
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

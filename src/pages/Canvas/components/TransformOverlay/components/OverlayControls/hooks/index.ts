import React from 'react';

import { BlockType } from '@/constants';
import { useMouseMove } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { useCanvasIdle } from '@/pages/Canvas/hooks';
import { MarkupTransform, TransformOverlayAPI } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';
import { Coords } from '@/utils/geometry';

import { HandlePosition } from '../../../constants';
import { OverlayState } from '../types';
import { useCanvasInteractions, useResize, useRotate } from './transforms';

export type InternalTransformOverlayAPI = TransformOverlayAPI & {
  ref: React.RefObject<HTMLDivElement>;
  startResize: (handle: HandlePosition) => () => void;
  startRotate: () => void;
};

// eslint-disable-next-line import/prefer-default-export
export const useTransformOverlayAPI = (nodeType: BlockType | null) => {
  const engine = React.useContext(EngineContext)!;

  const ref = React.useRef<HTMLDivElement>(null);
  const handlePosition = React.useRef<HandlePosition | null>(null);
  const snapshot = React.useRef<MarkupTransform | null>(null);
  const position = React.useRef<Point | null>(null);
  const size = React.useRef<Pair<number> | null>(null);
  const rotation = React.useRef<number | null>(null);
  const isRotating = React.useRef(false);
  const zoom = React.useRef(0);

  const state: OverlayState = {
    ref,
    handlePosition,
    position,
    snapshot,
    size,
    rotation,
    isRotating,
    zoom,
  };

  const onPan = React.useCallback(
    ([moveX, moveY]: Pair<number>) => {
      if (!position.current) return;

      const el = ref.current!;
      const [left, top] = position.current!;

      const nextX = left + moveX;
      const nextY = top + moveY;

      position.current = [nextX, nextY];

      window.requestAnimationFrame(() => {
        el.style.left = `${nextX}px`;
        el.style.top = `${nextY}px`;
      });
    },
    [nodeType]
  );

  const { startResize, resizeOverlay, endResize, handleResize } = useResize(nodeType, state);
  const { startRotate, endRotate, handleRotate } = useRotate(state);

  const onTransformStart = React.useCallback(() => {
    const markupNodeID = engine.focus.getTarget()!;
    engine.drag.setTarget(markupNodeID);

    document.addEventListener(
      'mouseup',
      () => {
        endResize();
        endRotate();
        engine.node.drop();

        return engine.transformation.complete();
      },
      { once: true }
    );

    engine.transformation.start();
  }, []);

  useCanvasIdle(() => engine.transformation.reinitialize());

  useCanvasInteractions(onPan, state);

  useMouseMove(
    (event) => {
      if (handlePosition.current) {
        handleResize(event);
      } else if (isRotating.current) {
        handleRotate();
      }
    },
    [handleResize, handleRotate]
  );

  return React.useMemo<InternalTransformOverlayAPI>(
    () => ({
      ref,

      initialize: (transform) => {
        const el = ref.current!;
        const rawOrigin = transform.origin.raw();

        snapshot.current = transform;
        position.current = rawOrigin;
        rotation.current = transform.rotate;
        size.current = [transform.width, transform.height];
        zoom.current = 1;

        window.requestAnimationFrame(() => {
          el.style.display = 'block';
          el.style.left = `${rawOrigin[0]}px`;
          el.style.top = `${rawOrigin[1]}px`;
          el.style.width = `${transform.width}px`;
          el.style.height = `${transform.height}px`;
          el.style.transform = `rotate(${transform.rotate}rad)`;
        });
      },

      resize: resizeOverlay,

      clearTransformations: () => {
        const [width, height] = size.current!;
        const [originX, originY] = position.current!;
        const rotate = rotation.current!;

        snapshot.current = {
          origin: new Coords([originX, originY]),
          width,
          height,
          rotate,
          scale: 1,
          invertX: false,
          invertY: false,
        };
        zoom.current = 1;
      },

      startResize: (handle) => () => {
        startResize(handle);

        onTransformStart();
      },

      startRotate: () => {
        startRotate();

        onTransformStart();
      },

      translate: ([moveX, moveY]) => {
        const canvasZoom = engine.canvas!.getZoom();

        onPan([moveX * canvasZoom, moveY * canvasZoom]);
      },

      reset: () => {
        const el = ref.current!;

        snapshot.current = null;
        position.current = null;
        size.current = null;
        handlePosition.current = null;
        zoom.current = 0;
        isRotating.current = false;

        window.requestAnimationFrame(() => {
          el.style.display = 'none';
          el.style.transform = '';
        });
      },
    }),
    [onPan, onTransformStart]
  );
};

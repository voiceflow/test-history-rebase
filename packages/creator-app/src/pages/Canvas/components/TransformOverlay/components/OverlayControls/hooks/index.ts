import { useMouseMove } from '@voiceflow/ui';
import React from 'react';

import { BlockType } from '@/constants';
import { useRAF } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { useCanvasIdle } from '@/pages/Canvas/hooks';
import { MarkupTransform, TransformOverlayAPI } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';
import { Coords } from '@/utils/geometry';

import { HandlePosition } from '../../../constants';
import { calculateRotatedBoundingRect } from '../../../utils';
import { OverlayState } from '../types';
import { useCanvasInteractions, useResize, useRotate } from './transforms';

export interface InternalTransformOverlayAPI extends TransformOverlayAPI {
  ref: React.RefObject<HTMLDivElement>;
  startResize: (handle: HandlePosition) => () => void;
  startRotate: () => void;
}

export const useTransformOverlayAPI = (nodeType: BlockType | null) => {
  const engine = React.useContext(EngineContext)!;

  const ref = React.useRef<HTMLDivElement>(null);
  const size = React.useRef<Pair<number> | null>(null);
  const snapshot = React.useRef<MarkupTransform | null>(null);
  const position = React.useRef<Point | null>(null);
  const rotation = React.useRef<number | null>(null);
  const isRotating = React.useRef(false);
  const handlePosition = React.useRef<HandlePosition | null>(null);

  const [resetStylesScheduler] = useRAF();
  const [initializeStylesScheduler] = useRAF();

  const state: OverlayState = {
    ref,
    size,
    position,
    snapshot,
    rotation,
    isRotating,
    handlePosition,
  };

  const { startResize, resizeOverlay, endResize, handleResize } = useResize(nodeType, state);
  const { startRotate, endRotate, handleRotate } = useRotate(state);

  const onTransformStart = React.useCallback(() => {
    const markupNodeID = engine.focus.getTarget();

    if (markupNodeID === null) return;

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
  useCanvasInteractions(resizeOverlay);

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
        const rotatedRect = calculateRotatedBoundingRect(transform.rect, transform.rotate);

        snapshot.current = { ...transform, rect: rotatedRect };

        position.current = [rotatedRect.left, rotatedRect.top];
        rotation.current = transform.rotate;
        size.current = [rotatedRect.width, rotatedRect.height];

        initializeStylesScheduler(() => {
          if (ref.current === null || position.current === null || size.current === null) return;

          ref.current.style.display = 'block';
          ref.current.style.left = `${position.current[0]}px`;
          ref.current.style.top = `${position.current[1]}px`;
          ref.current.style.width = `${size.current[0]}px`;
          ref.current.style.height = `${size.current[1]}px`;
          ref.current.style.transform = `rotate(${rotation.current}rad)`;
        });
      },

      resize: resizeOverlay,

      clearTransformations: () => {
        const rotate = rotation.current ?? 0;
        const [width, height] = size.current ?? [0, 0];
        const [originX, originY] = position.current ?? [0, 0];

        snapshot.current = {
          rect: new DOMRect(originX, originY, width, height),
          origin: new Coords([originX, originY]),
          rotate,
          invertX: false,
          invertY: false,
        };
      },

      startResize: (handle) => () => {
        startResize(handle);

        onTransformStart();
      },

      startRotate: () => {
        startRotate();

        onTransformStart();
      },

      reset: () => {
        size.current = null;

        snapshot.current = null;
        position.current = null;
        isRotating.current = false;
        handlePosition.current = null;

        resetStylesScheduler(() => {
          if (!ref.current) return;

          ref.current.style.display = 'none';
          ref.current.style.transform = '';
        });
      },
    }),
    [onTransformStart]
  );
};

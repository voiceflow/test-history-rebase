import React from 'react';

import { BlockType } from '@/constants';
import { useRAF } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { useCanvasIdle } from '@/pages/Canvas/hooks/canvas';
import { MarkupTransform, TransformOverlayAPI } from '@/pages/Canvas/types';

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
  const snapshot = React.useRef<MarkupTransform | null>(null);
  const overlayRect = React.useRef<DOMRect | null>(null);
  const rotation = React.useRef<number | null>(null);

  const [resetStylesScheduler] = useRAF();
  const [initializeStylesScheduler] = useRAF();

  const state: OverlayState = {
    overlayRect,
    snapshot,
    rotation,
  };

  const drawOverlay = React.useCallback(() => {
    if (!ref.current || !overlayRect.current) return;

    const { top, left, width, height } = overlayRect.current;

    ref.current.style.top = `${top}px`;
    ref.current.style.left = `${left}px`;
    ref.current.style.width = `${width}px`;
    ref.current.style.height = `${height}px`;
    ref.current.style.transform = `rotate(${rotation.current ?? 0}rad)`;
  }, []);

  const sync = React.useCallback((transform: MarkupTransform) => {
    overlayRect.current = calculateRotatedBoundingRect(transform.rect, rotation.current ?? 0);
    drawOverlay();
  }, []);

  const startResize = useResize(nodeType, state);
  const startRotate = useRotate(state);

  useCanvasIdle(() => engine.transformation.reinitialize());
  useCanvasInteractions(sync);

  return React.useMemo<InternalTransformOverlayAPI>(
    () => ({
      ref,

      initialize: (transform) => {
        const rotatedRect = calculateRotatedBoundingRect(transform.rect, transform.rotate);

        snapshot.current = { ...transform, rect: rotatedRect };
        overlayRect.current = rotatedRect;
        rotation.current = transform.rotate;

        initializeStylesScheduler(() => {
          if (ref.current === null) return;
          ref.current.style.display = 'block';
          drawOverlay();
        });
      },

      sync,

      clearTransformations: () => {
        const rotate = rotation.current ?? 0;
        const { top = 0, left = 0, width = 0, height = 0 } = overlayRect.current ?? {};

        snapshot.current = {
          rect: new DOMRect(left, top, width, height),
          rotate,
        };
      },

      startResize: (handle) => () => startResize(handle),
      startRotate,

      reset: () => {
        snapshot.current = null;
        overlayRect.current = null;

        resetStylesScheduler(() => {
          if (!ref.current) return;

          ref.current.style.display = 'none';
          ref.current.style.transform = '';
        });
      },
    }),
    []
  );
};

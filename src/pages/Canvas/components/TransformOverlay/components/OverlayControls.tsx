import React from 'react';

import Portal from '@/components/Portal';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { useMouseMove } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { useCanvasIdle, useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks';
import { ConnectedProps, Pair, Point } from '@/types';
import { buildVirtualDOMRect } from '@/utils/dom';

import { HandlePosition } from '../constants';
import { useCurried } from '../hooks';
import { getResizeTransformations } from '../utils';
import Overlay from './Overlay';

export type OverlayControlsRenderProps = {
  nodeType: BlockType | null;
  onRotateStart: () => void;
  onResizeStart: (handle: HandlePosition) => () => void;
};

export type OverlayControlsProps = {
  children: (renderProps: OverlayControlsRenderProps) => React.ReactNode;
};

const OverlayControls: React.FC<OverlayControlsProps & ConnectedOverlayControlsProps> = ({ node, children }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const handlePosition = React.useRef<HandlePosition | null>(null);
  const snapshot = React.useRef<DOMRect | null>(null);
  const position = React.useRef<Point | null>(null);
  const size = React.useRef<Pair<number> | null>(null);
  const isRotating = React.useRef(false);
  const zoom = React.useRef(0);
  const engine = React.useContext(EngineContext)!;

  const onTransformStart = React.useCallback(() => {
    document.addEventListener(
      'mouseup',
      () => {
        handlePosition.current = null;
        isRotating.current = false;

        return engine.transformation.complete();
      },
      { once: true }
    );

    engine.transformation.start();
  }, []);

  const onResizeStart = useCurried(
    (handle: HandlePosition) => () => {
      handlePosition.current = handle;

      onTransformStart();
    },
    [onTransformStart]
  );

  const onRotateStart = React.useCallback(() => {
    isRotating.current = true;

    onTransformStart();
  }, [onTransformStart]);

  const onPan = React.useCallback(([moveX, moveY]: Pair<number>) => {
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
  }, []);

  const onResize = React.useCallback((event: MouseEvent) => {
    const mousePosition = engine.mousePosition.current!;
    const handle = handlePosition.current!;
    const el = ref.current!;
    const rect = snapshot.current!;
    const [width, height] = size.current!;
    const [left, top] = position.current!;
    const [mouseX, mouseY] = mousePosition;

    const result = getResizeTransformations(rect, handle, [left, top], [width, height], [mouseX, mouseY], event);
    const [nextLeft, nextTop] = result.position;
    const [nextWidth, nextHeight] = result.size;

    size.current = result.size;
    position.current = result.position;

    engine.transformation.scaleTarget(result.scale, result.offset);
    window.requestAnimationFrame(() => {
      el.style.left = `${nextLeft}px`;
      el.style.top = `${nextTop}px`;
      el.style.width = `${nextWidth}px`;
      el.style.height = `${nextHeight}px`;
    });
  }, []);

  const onRotate = React.useCallback(() => {
    const mousePosition = engine.mousePosition.current!;
    const el = ref.current!;
    const rect = snapshot.current!;
    const [mouseX, mouseY] = mousePosition;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = mouseX - centerX;
    const deltaY = centerY - mouseY;
    const angle = Math.atan(deltaX / deltaY);
    const rotate = deltaY > 0 ? angle : Math.PI + angle;

    engine.transformation.rotateTarget(rotate);
    window.requestAnimationFrame(() => {
      el.style.transform = `rotate(${rotate}rad)`;
    });
  }, []);

  useCanvasIdle(() => engine.transformation.reinitialize());

  useCanvasPan(onPan);

  useCanvasZoom((calculateMovement) => {
    if (!position.current) return;

    const el = ref.current!;
    const [x, y] = position.current!;
    const [width, height] = size.current!;
    const [moveX, moveY, zoomDiffFactor] = calculateMovement(engine.canvas!.mapPoint([x, y]));
    const nextX = x + moveX;
    const nextY = y + moveY;
    const nextZoom = zoom.current * zoomDiffFactor;

    position.current = [nextX, nextY];
    zoom.current = nextZoom;

    window.requestAnimationFrame(() => {
      el.style.left = `${nextX}px`;
      el.style.top = `${nextY}px`;
      el.style.width = `${width * nextZoom}px`;
      el.style.height = `${height * nextZoom}px`;
    });
  });

  useMouseMove(
    (event) => {
      if (handlePosition.current) {
        onResize(event);
      } else if (isRotating.current) {
        onRotate();
      }
    },
    [onResize, onRotate]
  );

  React.useEffect(() => {
    engine.transformation.registerTransformOverlay({
      initialize: (rect) => {
        const el = ref.current!;

        snapshot.current = rect;
        position.current = [rect.left, rect.top];
        size.current = [rect.width, rect.height];
        zoom.current = 1;

        window.requestAnimationFrame(() => {
          el.style.display = 'block';
          el.style.top = `${rect.top}px`;
          el.style.left = `${rect.left}px`;
          el.style.width = `${rect.width}px`;
          el.style.height = `${rect.height}px`;
        });
      },

      clearTransformations: () => {
        const rect = buildVirtualDOMRect(position.current!, size.current!);

        snapshot.current = rect;
        zoom.current = 1;
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
    });

    return () => engine.transformation.registerTransformOverlay(null);
  }, []);

  return (
    <Portal>
      <Overlay ref={ref}>{children({ nodeType: node?.type || null, onResizeStart, onRotateStart })}</Overlay>
    </Portal>
  );
};

const mapStateToProps = {
  node: Creator.focusedNodeDataSelector,
};

type ConnectedOverlayControlsProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(OverlayControls) as React.FC<OverlayControlsProps>;

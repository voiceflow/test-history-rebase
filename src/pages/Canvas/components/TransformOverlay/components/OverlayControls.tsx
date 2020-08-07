import React from 'react';

import Portal from '@/components/Portal';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { useMouseMove } from '@/hooks';
import { Markup, NodeData } from '@/models';
import { EngineContext } from '@/pages/Canvas/contexts';
import { useCanvasIdle, useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks';
import { MarkupTransform } from '@/pages/Canvas/types';
import { ConnectedProps, Pair, Point } from '@/types';
import { getRotation } from '@/utils/math';

import { HandlePosition, TEXT_WIDTH_HANDLES } from '../constants';
import { useCurried } from '../hooks';
import { getResizeTransformations } from '../utils';
import Overlay from './Overlay';

type LineVertex = 'origin' | 'terminal';

export type OverlayControlsRenderProps = {
  nodeType: BlockType | null;
  data: NodeData<Markup.AnyNodeData> | null;
  onRotateStart: () => void;
  onDragVertex: (vertex: LineVertex) => () => void;
  onResizeStart: (handle: HandlePosition) => () => void;
};

export type OverlayControlsProps = {
  children: (renderProps: OverlayControlsRenderProps) => React.ReactNode;
};

const OverlayControls: React.FC<OverlayControlsProps & ConnectedOverlayControlsProps> = ({ node, children }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const handlePosition = React.useRef<HandlePosition | null>(null);
  const lineVertex = React.useRef<LineVertex | null>(null);
  const snapshot = React.useRef<MarkupTransform | null>(null);
  const position = React.useRef<Point | null>(null);
  const size = React.useRef<Pair<number> | null>(null);
  const isRotating = React.useRef(false);
  const zoom = React.useRef(0);
  const engine = React.useContext(EngineContext)!;
  const data = node ? engine.getDataByNodeID<Markup.NodeData.Shape>(node.nodeID) : null;
  const nodeType = node?.type || null;

  const onTransformStart = React.useCallback(() => {
    const markupNodeID = engine.focus.getTarget()!;
    engine.drag.setTarget(markupNodeID);

    document.addEventListener(
      'mouseup',
      () => {
        handlePosition.current = null;
        lineVertex.current = null;
        isRotating.current = false;

        engine.node.drop();

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

  const onDragVertex = useCurried(
    (vertex: LineVertex) => () => {
      lineVertex.current = vertex;

      onTransformStart();
    },
    [onTransformStart]
  );

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

  const onResize = React.useCallback(
    (event: MouseEvent) => {
      const mousePosition = engine.mousePosition.current!;
      const handle = handlePosition.current!;
      const el = ref.current!;
      const transform = snapshot.current!;
      const [width, height] = size.current!;
      const [left, top] = position.current!;
      const [mouseX, mouseY] = mousePosition;
      const isTextNode = nodeType === BlockType.MARKUP_TEXT;

      const result = getResizeTransformations(transform, handle, [left, top], [width, height], [mouseX, mouseY], event, isTextNode);
      let [nextLeft, nextTop] = result.position;
      let [nextWidth, nextHeight] = result.size;

      if (isTextNode) {
        if (TEXT_WIDTH_HANDLES.includes(handle)) {
          engine.transformation.scaleTextTarget(Math.abs(mouseX - nextLeft));
        } else {
          const halfWidth = transform.width / 2;
          const halfHeight = transform.height / 2;
          const originX = transform.originX + halfWidth;
          const originY = transform.originY + halfHeight;

          const diffX = Math.abs(mouseX - originX);
          const diffY = Math.abs(mouseY - originY);

          const scaleX = diffX / halfWidth;
          const scaleY = diffY / halfHeight;
          const scale = Math.max(scaleX, scaleY);

          nextWidth = transform.width * scale;
          nextHeight = transform.height * scale;
          nextLeft = originX - nextWidth / 2;
          nextTop = originY - nextHeight / 2;

          engine.transformation.scaleTarget([scale, scale], [0, 0]);
        }
      } else {
        engine.transformation.scaleTarget(result.scale, result.shift);
      }

      position.current = [nextLeft, nextTop];
      size.current = [nextWidth, nextHeight];

      window.requestAnimationFrame(() => {
        el.style.left = `${nextLeft}px`;
        el.style.top = `${nextTop}px`;
        el.style.width = `${nextWidth}px`;
        el.style.height = `${nextHeight}px`;
      });
    },
    [nodeType]
  );

  const onRotate = React.useCallback(() => {
    const mousePosition = engine.mousePosition.current!;
    const el = ref.current!;
    const transform = snapshot.current!;
    const [mouseX, mouseY] = mousePosition;
    const centerX = transform.originX + transform.width / 2;
    const centerY = transform.originY + transform.height / 2;
    const deltaX = mouseX - centerX;
    const deltaY = centerY - mouseY;
    const rotate = getRotation(deltaX, deltaY);

    engine.transformation.rotateTarget(rotate);
    window.requestAnimationFrame(() => {
      el.style.transform = `rotate(${rotate}rad)`;
    });
  }, []);

  const onRedraw = React.useCallback(() => {
    const mousePosition = engine.mousePosition.current!;
    const canvasZoom = engine.canvas!.getZoom();
    const el = ref.current!;
    const vertex = lineVertex.current!;
    const transform = snapshot.current!;
    const [mouseX, mouseY] = mousePosition;

    if (vertex === 'terminal') {
      const originX = transform.originX + (transform.invertX ? transform.width : 0);
      const originY = transform.originY + (transform.invertY ? transform.height : 0);
      const deltaX = mouseX - originX;
      const deltaY = mouseY - originY;
      const width = Math.abs(deltaX);
      const height = Math.abs(deltaY);

      engine.transformation.moveVertices([deltaX / canvasZoom, deltaY / canvasZoom], [0, 0]);
      window.requestAnimationFrame(() => {
        el.style.left = `${Math.min(originX, mouseX)}px`;
        el.style.top = `${Math.min(originY, mouseY)}px`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
      });
    } else {
      const terminalX = transform.originX + (transform.invertX ? 0 : transform.width);
      const terminalY = transform.originY + (transform.invertY ? 0 : transform.height);
      const deltaX = mouseX - terminalX;
      const deltaY = mouseY - terminalY;
      const width = Math.abs(deltaX);
      const height = Math.abs(deltaY);

      engine.transformation.moveVertices([-deltaX / canvasZoom, -deltaY / canvasZoom], [transform.width - width, transform.height - height]);
      window.requestAnimationFrame(() => {
        el.style.left = `${Math.min(terminalX, mouseX)}px`;
        el.style.top = `${Math.min(terminalY, mouseY)}px`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
      });
    }
  }, []);

  useCanvasIdle(() => engine.transformation.reinitialize());

  useCanvasPan(onPan, [onPan]);

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
      } else if (lineVertex.current) {
        onRedraw();
      }
    },
    [onResize, onRotate, onRedraw]
  );

  React.useEffect(
    () =>
      engine.transformation.register('transformOverlay', {
        initialize: (transform) => {
          const el = ref.current!;

          snapshot.current = transform;
          position.current = [transform.originX, transform.originY];
          size.current = [transform.width, transform.height];
          zoom.current = 1;

          window.requestAnimationFrame(() => {
            el.style.display = 'block';
            el.style.left = `${transform.originX}px`;
            el.style.top = `${transform.originY}px`;
            el.style.width = `${transform.width}px`;
            el.style.height = `${transform.height}px`;
            el.style.transform = `rotate(${transform.rotate}rad)`;
          });
        },

        clearTransformations: () => {
          const [width, height] = size.current!;
          const [originX, originY] = position.current!;

          snapshot.current = {
            originX,
            originY,
            width,
            height,
            rotate: 0,
            scale: 1,
            invertX: false,
            invertY: false,
          };
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
          lineVertex.current = null;
          zoom.current = 0;
          isRotating.current = false;

          window.requestAnimationFrame(() => {
            el.style.display = 'none';
            el.style.transform = '';
          });
        },
      }),
    [onPan]
  );

  return (
    <Portal>
      <Overlay ref={ref}>{children({ nodeType, data, onResizeStart, onRotateStart, onDragVertex })}</Overlay>
    </Portal>
  );
};

const mapStateToProps = {
  node: Creator.focusedNodeDataSelector,
};

type ConnectedOverlayControlsProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(OverlayControls) as React.FC<OverlayControlsProps>;

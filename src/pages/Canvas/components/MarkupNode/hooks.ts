import React from 'react';

import { BlockType } from '@/constants';
import { Markup } from '@/models';
import { useNodeInstance } from '@/pages/Canvas/components/Node/hooks';
import { InternalNodeInstance } from '@/pages/Canvas/components/Node/types';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { Pair } from '@/types';
import { getRotation } from '@/utils/math';

import { MarkupShapeInstance, ResizableMarkupNodeData } from './types';
import { isLine, isResizableShape, isShape, isText } from './utils';

export type InternalMarkupInstance<T extends HTMLElement> = InternalNodeInstance<T> & {
  transformRef: React.RefObject<T>;
  shapeRef: React.RefObject<MarkupShapeInstance>;
};

export const useMarkupInstance = <T extends HTMLElement>() => {
  const shapeRef = React.useRef<MarkupShapeInstance>(null);
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { width, height } = nodeEntity.useState((e) => {
    const { data } = e.resolve<ResizableMarkupNodeData>();

    return {
      width: data.width,
      height: data.height,
    };
  });
  const engine = React.useContext(EngineContext)!;
  const scale = React.useRef<Pair<number>>([1, 1]);
  const rotation = React.useRef<number>(0);
  const transformRef = React.useRef<T>(null);
  const textWidth = React.useRef<number | null>(null);
  const nodeInstance = useNodeInstance<T>();

  const getTransform = React.useCallback(() => {
    const { data } = nodeEntity.resolve<Markup.AnyNodeData>();
    const zoom = engine.canvas!.getZoom();
    const rect = transformRef.current!.getBoundingClientRect();
    const position = engine.node.api(nodeEntity.nodeID)!.instance!.getPosition();
    const [left, top] = engine.canvas!.reverseMapPoint(engine.canvas!.reverseTransformPoint(position, true));

    if (isText(data)) {
      const scaledWidth = data.width ? data.width * data.scale : rect.width;

      return {
        originX: rect.left,
        originY: rect.top,
        width: scaledWidth,
        height: rect.height,
        rotate: data.rotate,
        scale: data.scale,
        invertX: false,
        invertY: false,
      };
    }

    if (isShape(data) && isLine(data)) {
      const { offsetX, offsetY } = data;
      const diffX = offsetX * zoom;
      const diffY = offsetY * zoom;

      return {
        originX: left + Math.min(0, diffX),
        originY: top + Math.min(0, diffY),
        width: Math.abs(diffX),
        height: Math.abs(diffY),
        rotate: 0,
        scale: 1,
        invertX: offsetX < 0,
        invertY: offsetY < 0,
      };
    }

    const resizableData = data as ResizableMarkupNodeData;

    return {
      originX: left,
      originY: top,
      width: resizableData.width * zoom,
      height: resizableData.height * zoom,
      rotate: resizableData.rotate,
      scale: 1,
      invertX: false,
      invertY: false,
    };
  }, []);

  React.useEffect(
    () => () => {
      const transformEl = transformRef.current!;

      window.requestAnimationFrame(() => {
        transformEl.style.transformOrigin = '';
        transformEl.style.transform = '';
      });
    },
    [width, height]
  );

  return React.useMemo<InternalMarkupInstance<T>>(
    () => ({
      ...nodeInstance,
      transformRef,
      shapeRef,
      getTransform,
      snapshot: () => {
        if (nodeEntity.nodeType !== BlockType.MARKUP_SHAPE) return;

        const { data } = nodeEntity.resolve<ResizableMarkupNodeData>();
        const transformEl = transformRef.current!;

        window.requestAnimationFrame(() => {
          transformEl.style.width = `${data.width}px`;
          transformEl.style.height = `${data.height}px`;
        });
      },
      applyTransformations: () => {
        const data = engine.getDataByNodeID<any>(nodeEntity.nodeID);
        const [scaleX, scaleY] = scale.current!;
        const angle = rotation.current;
        const maxWidth = textWidth.current;

        scale.current = [1, 1];
        rotation.current = 0;
        textWidth.current = null;

        if (isResizableShape(data)) {
          engine.node.updateData<ResizableMarkupNodeData>(nodeEntity.nodeID, {
            width: data.width * scaleX,
            height: data.height * scaleY,
            rotate: angle % (2 * Math.PI),
          });
        } else if (data.type === BlockType.MARKUP_TEXT) {
          engine.node.updateData<Markup.NodeData.Text>(nodeEntity.nodeID, {
            scale: scaleX,
            ...(maxWidth !== null && { width: maxWidth }),
          });
        }
      },
      rotate: (angle) => {
        const transformEl = transformRef.current!;

        rotation.current = angle;

        window.requestAnimationFrame(() => {
          transformEl.style.transformOrigin = 'center';
          transformEl.style.transform = `rotate(${angle}rad)`;
        });
      },
      // moveVertices: ([offsetX, offsetY], [shiftX, shiftY]) => {
      moveVertices: ([offsetX, offsetY]) => {
        const shapeEl = shapeRef.current;

        const rotate = getRotation(offsetY, offsetX);

        window.requestAnimationFrame(() => {
          // shapeEl?.setAttribute('x1', String(shiftX));
          // shapeEl?.setAttribute('y1', String(shiftY));
          shapeEl?.setLineAttribute?.('x2', String(offsetX));
          shapeEl?.setLineAttribute?.('y2', String(offsetY));
          shapeEl?.setHeadAttribute?.('orient', `${rotate}rad`);
        });
      },
      scale: ([scaleX, scaleY], [offsetX, offsetY], rotate, [rotationOffsetX, rotationOffsetY]) => {
        const { data } = nodeEntity.resolve<Markup.AnyNodeData>();
        const transformEl = transformRef.current!;
        const zoom = engine.canvas!.getZoom();
        const isTextNode = data.type === BlockType.MARKUP_TEXT;

        const nextScaleX = scaleX * (isTextNode ? (data as Markup.NodeData.Text).scale : 1);
        const nextScaleY = scaleY * (isTextNode ? (data as Markup.NodeData.Text).scale : 1);

        scale.current = [nextScaleX, nextScaleY];
        rotation.current = rotate;

        engine.node.translate(nodeEntity.nodeID, [offsetX / zoom, offsetY / zoom]);

        window.requestAnimationFrame(() => {
          if (!isTextNode) {
            transformEl.style.transformOrigin = 'left top';
          }
          transformEl.style.transform = `translate(${rotationOffsetX / zoom}px, ${
            rotationOffsetY / zoom
          }px) scale(${nextScaleX}, ${nextScaleY}) rotate(${(data as ResizableMarkupNodeData).rotate}rad)`;
        });
      },
      scaleText: (maxWidth: number) => {
        const transformEl = transformRef.current!;
        const { data } = nodeEntity.resolve<Markup.NodeData.Text>();
        const zoom = engine.canvas!.getZoom();

        const nextWidth = maxWidth / data.scale / zoom;

        textWidth.current = nextWidth;

        window.requestAnimationFrame(() => {
          transformEl.style.width = `${nextWidth}px`;
        });
      },
    }),
    [nodeInstance, getTransform]
  );
};

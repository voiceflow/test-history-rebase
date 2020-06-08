import React from 'react';

import { BlockType } from '@/constants';
import { Markup } from '@/models';
import { useNodeInstance } from '@/pages/Canvas/components/Node/hooks';
import { InternalNodeInstance } from '@/pages/Canvas/components/Node/types';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { Pair } from '@/types';

export type InternalMarkupInstance<T extends HTMLElement> = InternalNodeInstance<T> & {
  transformRef: React.RefObject<T>;
};

export const useMarkupInstance = <T extends HTMLElement>() => {
  const snapshot = React.useRef<DOMRect | null>(null);
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { width, height } = nodeEntity.useState((e) => {
    const data: Markup.RectangleShapeNodeData = e.resolve().data as any;

    return {
      width: data.width,
      height: data.height,
    };
  });
  const engine = React.useContext(EngineContext)!;
  const scale = React.useRef<Pair<number>>([1, 1]);
  const rotation = React.useRef<number>(0);
  const transformRef = React.useRef<T>(null);
  const nodeInstance = useNodeInstance<T>();

  const getTransformRect = React.useCallback(() => transformRef.current?.getBoundingClientRect() || null, []);

  const scaleMarkup = React.useCallback(([scaleX, scaleY]: Pair<number>, [offsetX, offsetY]: Pair<number>) => {
    const transformEl = transformRef.current!;
    const zoom = engine.canvas!.getZoom();

    scale.current = [scaleX, scaleY];

    engine.node.translate(nodeEntity.nodeID, [offsetX / zoom, offsetY / zoom]);

    window.requestAnimationFrame(() => {
      transformEl.style.transformOrigin = 'left top';
      transformEl.style.transform = `scale(${scaleX}, ${scaleY})`;
    });
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
      getTransformRect,
      snapshot: () => {
        snapshot.current = getTransformRect()!;
      },
      applyTransformations: () => {
        const nodeType = nodeEntity.nodeType;

        const data = engine.getDataByNodeID<any>(nodeEntity.nodeID);
        const [scaleX, scaleY] = scale.current!;
        const angle = rotation.current;

        snapshot.current = null;
        scale.current = [1, 1];
        rotation.current = 0;

        switch (nodeType) {
          case BlockType.MARKUP_IMAGE:
            engine.node.updateData<Markup.ImageNodeData>(nodeEntity.nodeID, {
              width: (data as Markup.ImageNodeData).width * scaleX,
              height: (data as Markup.ImageNodeData).height * scaleY,
              rotate: ((data as Markup.ImageNodeData).rotate + angle) % (2 * Math.PI),
            });
            break;
          case BlockType.MARKUP_SHAPE:
            engine.node.updateData<Markup.RectangleShapeNodeData>(nodeEntity.nodeID, {
              width: (data as Markup.RectangleShapeNodeData).width * scaleX,
              height: (data as Markup.RectangleShapeNodeData).height * scaleY,
              rotate: ((data as Markup.ImageNodeData).rotate + angle) % (2 * Math.PI),
            });
            break;
          case BlockType.MARKUP_TEXT:
            engine.node.updateData<Markup.TextNodeData>(nodeEntity.nodeID, { scale: scaleX });
            break;
          default:
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
      scale: scaleMarkup,
    }),
    [nodeInstance]
  );
};

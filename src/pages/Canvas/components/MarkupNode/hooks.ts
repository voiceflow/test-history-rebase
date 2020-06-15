import React from 'react';

import { BlockType } from '@/constants';
import { Markup, NodeData } from '@/models';
import { useNodeInstance } from '@/pages/Canvas/components/Node/hooks';
import { InternalNodeInstance } from '@/pages/Canvas/components/Node/types';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { Pair } from '@/types';

type ResizableMarkupNodeData = Markup.NodeData.Image | Markup.NodeData.Rectangle | Markup.NodeData.Circle;

const isResizableShape = (data: NodeData<any>): data is NodeData<ResizableMarkupNodeData> =>
  [BlockType.MARKUP_IMAGE, BlockType.MARKUP_SHAPE].includes(data.type);

export type InternalMarkupInstance<T extends HTMLElement> = InternalNodeInstance<T> & {
  transformRef: React.RefObject<T>;
};

export const useMarkupInstance = <T extends HTMLElement>() => {
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const { width, height } = nodeEntity.useState((e) => {
    const { data } = e.resolve<Markup.NodeData.Rectangle>();

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
      applyTransformations: () => {
        const data = engine.getDataByNodeID<any>(nodeEntity.nodeID);
        const [scaleX, scaleY] = scale.current!;
        const angle = rotation.current;

        scale.current = [1, 1];
        rotation.current = 0;

        if (isResizableShape(data)) {
          engine.node.updateData<ResizableMarkupNodeData>(nodeEntity.nodeID, {
            width: data.width * scaleX,
            height: data.height * scaleY,
            rotate: (data.rotate + angle) % (2 * Math.PI),
          });
        } else if (data.type === BlockType.MARKUP_TEXT) {
          engine.node.updateData<Markup.NodeData.Text>(nodeEntity.nodeID, { scale: scaleX });
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

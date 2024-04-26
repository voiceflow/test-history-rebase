import type * as Realtime from '@voiceflow/realtime-sdk';
import { useConst, useCreateConst } from '@voiceflow/ui';
import React from 'react';

import { BlockType } from '@/constants';
import { useNodeInstance } from '@/pages/Canvas/components/Node/hooks';
import type { InternalNodeInstance } from '@/pages/Canvas/components/Node/types';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import type { Pair, Point } from '@/types';

import type { ResizableMarkupNodeData } from './types';
import { isResizableShape } from './utils';

export interface InternalMarkupInstance<T extends HTMLElement> extends InternalNodeInstance<T> {
  transformRef: React.RefObject<T>;
}

/**
 * Returns an interface for manipulating a Markup Node, e.g, an Image node or a Text Node. Markup's
 * rendering logic has roughly the following steps:
 *
 *    1. Execute a "transformation" function like `.rotate()` or `.scale()`
 *
 *    2. During exeution, track the changes caused by the transformation, which is stored in
 *       refs like `rotation.current` and `scale.current`
 *
 *    3. When the transformation is complete, `applyTransformation()` is invoked to reset all
 *       refs and publish the effects of the transformation to the Redux store.
 *
 * There may be some variation in the details of steps 1-3 depending on the type of Markup that
 * is being operated on.
 *
 */
export const useMarkupInstance = <T extends HTMLElement>() => {
  const engine = React.useContext(EngineContext)!;
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const nodeInstance = useNodeInstance<T>();

  // local transform values that need to synced with data
  const scale = React.useRef<Pair<number>>([1, 1]);
  const rotation = React.useRef<number>(0);
  const position = React.useRef<Point>(nodeInstance.getPosition());
  const textWidth = React.useRef<number | null>(null);

  const transformRef = React.useRef<T>(null);

  const isText = nodeEntity.nodeType === BlockType.MARKUP_TEXT;

  const data = nodeEntity.useState((e) => e.resolve<ResizableMarkupNodeData>().data);

  const getRectNode = useConst(() => {
    if (isText) {
      return nodeInstance.nodeRef.current?.ref.current ?? null;
    }

    return transformRef.current ?? null;
  });

  /**
   * Returns an object containing information about the final state, such as size and position, of the
   * markup overlay at the end of a transformation like resizing.
   */
  const getTransform = React.useCallback(() => {
    const rect = getRectNode()?.getBoundingClientRect();

    if (!engine.canvas || !transformRef.current || !rect) {
      return {
        rect: new DOMRect(),
        rotate: 0,
      };
    }

    const { data } = nodeEntity.resolve<Realtime.Markup.AnyNodeData>();
    const resizableData = data as ResizableMarkupNodeData;

    return {
      rect,
      rotate: resizableData.rotate,
    };
  }, []);

  const syncOverlay = useConst(() => {
    if (!engine.focus.isTarget(nodeEntity.nodeID)) return;

    engine.transformation.syncOverlay(getTransform());
  });

  const resizeObserver = useCreateConst(() => new ResizeObserver(syncOverlay));

  const applyStyling = React.useCallback(() => {
    window.requestAnimationFrame(() => {
      if (!transformRef.current) return;

      const transformation = `${isText ? `scale(${scale.current[0]}, ${scale.current[1]})` : 'translate(-50%, -50%)'} rotate(${rotation.current}rad)`;

      transformRef.current.style.transformOrigin = 'center';
      transformRef.current.style.transform = transformation;

      syncOverlay();
    });
  }, []);

  /** syncs the local transform values with the actual redux values and renders transformation */
  React.useEffect(() => {
    rotation.current = data.rotate;
    scale.current = [data.scale ?? 1, data.scale ?? 1];
    textWidth.current = data.overrideWidth || null;

    applyStyling();
  }, [data.rotate, data.scale, data.overrideWidth, data.width, data.height]);

  return React.useMemo<InternalMarkupInstance<T>>(
    () => ({
      ...nodeInstance,

      transformRef,
      getTransform,

      translate: (movement: Pair<number>) => nodeInstance.translate?.(movement, syncOverlay),

      /**
       * Used prepare the local state for transformation.
       */
      prepareForTransformation: () => {
        const rectNode = getRectNode();

        if (!transformRef.current || !isText || !rectNode) return;

        position.current = nodeInstance.getPosition();
        resizeObserver.observe(rectNode);
      },

      /**
       * Used at the end of a transformation to publish the final state of the node into
       * the Redux store.
       */
      applyTransformations: async () => {
        if (!scale.current) return;

        const data = engine.getDataByNodeID<any>(nodeEntity.nodeID);
        const [scaleX, scaleY] = scale.current;
        const rotate = rotation.current % (2 * Math.PI);
        const maxWidth = textWidth.current;

        resizeObserver.disconnect();

        if (isResizableShape(data)) {
          await engine.node.updateData<ResizableMarkupNodeData>(nodeEntity.nodeID, {
            width: data.width * scaleX,
            height: data.height * scaleY,
            rotate,
          });
        } else if (isText) {
          await engine.node.updateData<Realtime.Markup.NodeData.Text>(nodeEntity.nodeID, {
            scale: scaleX,
            rotate,
            ...(maxWidth !== null && { overrideWidth: maxWidth }),
          });
        }
        // save location from scaling transformations
        await engine.node.saveLocations([nodeEntity.nodeID]);
      },

      /**
       * Accumulates the effects of a rotation operation and applies the changes so far as a style
       * to the Node.
       */
      rotate: (angle) => {
        rotation.current = angle;
        applyStyling();
      },

      /**
       * Accumulates the effects of a scaling operation and applies the changes so far as a style to
       * the Node.
       */
      scale: ([scaleX, scaleY], [shiftX, shiftY]) => {
        if (engine.canvas == null) return;

        const { data } = nodeEntity.resolve<ResizableMarkupNodeData>();

        const nextScaleX = scaleX * (data.scale || 1);
        const nextScaleY = scaleY * (data.scale || 1);
        scale.current = [nextScaleX, nextScaleY];

        const zoom = engine.canvas.getZoom();
        engine.node.translate([nodeEntity.nodeID], [shiftX / zoom, shiftY / zoom]);

        window.requestAnimationFrame(() => {
          if (!transformRef.current) return;

          transformRef.current.style.transform = `${isText ? '' : 'translate(-50%, -50%)'} scale(${nextScaleX}, ${nextScaleY}) rotate(${
            data.rotate
          }rad)`;

          syncOverlay();
        });
      },

      /**
       * Accumulates the effects of a special case of the scaling operation, when we drag the horizontal handles
       * of a Markup Text node and applies the changes so far as a style to the Node.
       */
      scaleText: (maxWidth: number, [shiftX, shiftY]: Pair<number>) => {
        if (engine.canvas == null) return;
        const zoom = engine.canvas.getZoom();

        const currentScale = scale.current[0];
        const nextWidth = maxWidth / currentScale / zoom;

        textWidth.current = nextWidth;
        engine.node.translate([nodeEntity.nodeID], [shiftX / zoom, shiftY / zoom]);

        window.requestAnimationFrame(() => {
          if (!transformRef.current) return;

          // need to reset the min-width if this is the first time the container is being resized to clear the default
          transformRef.current.style.minWidth = '0';
          transformRef.current.style.width = `${nextWidth}px`;

          syncOverlay();
        });
      },
    }),
    [nodeInstance, getTransform]
  );
};

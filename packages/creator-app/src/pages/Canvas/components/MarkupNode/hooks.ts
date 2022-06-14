import * as Realtime from '@voiceflow/realtime-sdk';
import { useConst, useCreateConst } from '@voiceflow/ui';
import React from 'react';

import { BlockType } from '@/constants';
import { useNodeInstance } from '@/pages/Canvas/components/Node/hooks';
import { InternalNodeInstance } from '@/pages/Canvas/components/Node/types';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { Pair } from '@/types';
import { Coords } from '@/utils/geometry';

import { ResizableMarkupNodeData } from './types';
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

  const scale = React.useRef<Pair<number>>([1, 1]);
  const rotation = React.useRef<number>(0);
  const textWidth = React.useRef<number | null>(null);
  const transformRef = React.useRef<T>(null);

  const isText = nodeEntity.nodeType === BlockType.MARKUP_TEXT;

  const { width, height } = nodeEntity.useState((e) => {
    const { data } = e.resolve<ResizableMarkupNodeData>();

    return {
      width: data.width,
      height: data.height,
    };
  });

  const getRectNode = useConst(() => {
    if (isText) {
      return nodeInstance.blockRef.current?.ref.current ?? null;
    }

    return transformRef.current ?? null;
  });

  const resizeOverlay = useConst(() => {
    const rect = getRectNode()?.getBoundingClientRect();

    if (rect) {
      engine.transformation.resizeOverlay(rect);
    }
  });

  const resizeObserver = useCreateConst(() => new ResizeObserver(resizeOverlay));

  /**
   * Returns an object containing information about the final state, such as size and position, of the
   * markup overlay at the end of a transformation like resizing.
   */
  const getTransform = React.useCallback(() => {
    const position = engine.node.api(nodeEntity.nodeID)?.instance?.getPosition();
    const rect = getRectNode()?.getBoundingClientRect();

    if (!engine.canvas || !position || !transformRef.current || !rect) {
      return {
        rect: new DOMRect(),
        origin: new Coords([0, 0]),
        rotate: 0,
        invertX: false,
        invertY: false,
      };
    }

    const { data } = nodeEntity.resolve<Realtime.Markup.AnyNodeData>();

    const [left, top] = engine.canvas.reverseMapPoint(engine.canvas.reverseTransformPoint(position, true));
    const resizableData = data as ResizableMarkupNodeData;

    return {
      rect,
      rotate: resizableData.rotate,
      origin: new Coords([left, top]),
      invertX: false,
      invertY: false,
    };
  }, []);

  React.useEffect(
    () => () => {
      window.requestAnimationFrame(() => {
        if (!transformRef.current) return;

        transformRef.current.style.transformOrigin = '';
        transformRef.current.style.transform = '';
      });
    },
    [width, height]
  );

  return React.useMemo<InternalMarkupInstance<T>>(
    () => ({
      ...nodeInstance,

      transformRef,
      getTransform,

      translate: (movement: Pair<number>) => nodeInstance.translate?.(movement, resizeOverlay),

      /**
       * Used prepare the local state for transformation.
       */
      prepareForTransformation: () => {
        const rectNode = getRectNode();

        if (!transformRef.current || !isText || !rectNode) return;

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
        const angle = rotation.current;
        const maxWidth = textWidth.current;

        resizeObserver.disconnect();

        if (isResizableShape(data)) {
          await engine.node.updateData<ResizableMarkupNodeData>(nodeEntity.nodeID, {
            width: data.width * scaleX,
            height: data.height * scaleY,
            rotate: angle % (2 * Math.PI),
          });
        } else if (isText) {
          await engine.node.updateData<Realtime.Markup.NodeData.Text>(nodeEntity.nodeID, {
            scale: scaleX,
            rotate: angle % (2 * Math.PI),
            ...(maxWidth !== null && { overrideWidth: maxWidth }),
          });
        }

        scale.current = [1, 1];
        rotation.current = 0;
        textWidth.current = null;
      },

      /**
       * Accumulates the effects of a rotation operation and applies the changes so far as a style
       * to the Node.
       */
      rotate: (angle) => {
        rotation.current = angle;

        const { data } = nodeEntity.resolve<Realtime.Markup.AnyNodeData>();
        const curScale = (data as Realtime.Markup.NodeData.Text).scale;
        const maxWidth = (data as Realtime.Markup.NodeData.Text).overrideWidth;

        if (isText) {
          /**
           * We need to track the current scaling on the Markup Text, even if it's not relevant to the rotation
           * operation, because of how we've implemented scaling for Markup Text.
           *
           * Markup Text relies on the CSS animations defined in this `.rotate()` function and the `.scale()`
           * function. There is no prop, which when passed into a Markup Text React component, controls the
           * height and width of the Markup Text, unlike Markup Image. The scaling of a Markup Text is entirely
           * reliant on the CSS styling, `scale(...)`
           *
           * This is problematic because when you set a `transform` CSS property, it overwrites previous
           * transformations. Therefore, we need to apply not only a `rotate(...)` transform for Markup Text but
           * also a `scale(...)` transform in `rotate(...)`, so that both resizing and rotation is properly applied
           * on Markup Text.
           *
           * Additionally, `useMarkupInstance` implements `applyTransformation()` by resetting the amount of scaling to `[1,1]`,
           * then publishing to the Redux store. If you attempt to do two consecutive rotations, `applyTransformations()`
           * causes the scaling on the Markup Text to get reset and the Redux data to be set to the wrong value of 1.
           *
           * We need manually set `scale.current` here as a hack to ensure that `applyTransformation()` doesnt'
           * send the wrong data for Markup Text.
           *
           * $TODO - Need to either separate Markup Text logic to its own specialization of `useMarkupInstance` to avoid
           *         interweaving logic for Markup Text and Images, or come up with a better generalization.
           *
           */
          scale.current = [curScale, curScale];
          textWidth.current = maxWidth;
        }

        /**
         * As mentioned above, the Markup Text's scaling logic is "CSS-driven" in that we must have the correct
         * styling on the Markup Text node at all times to ensure the transformation applies. This is why we
         * must also apply the `scale(...)` transformation in addition to `rotate(...)` in Markup Text, so that
         * transformations get applied during and after a resize/rotation.
         *
         * Markup Images does not need this because it is "props-driven". The Markup Images can pull the current
         * width and height from the Redux store and receive it as props for its rendering. The CSS styling is
         * only needed to render Markup Imaegs during a resize.
         */
        const transformation = `${isText ? `scale(${curScale}, ${curScale})` : ''} rotate(${angle}rad)`;

        window.requestAnimationFrame(() => {
          if (!transformRef.current) return;

          transformRef.current.style.transformOrigin = 'center';
          transformRef.current.style.transform = transformation;

          resizeOverlay();
        });
      },

      /**
       * Accumulates the effects of a scaling operation and applies the changes so far as a style to
       * the Node.
       */
      scale: ([scaleX, scaleY], [shiftX, shiftY], rotate, [rotationOffsetX, rotationOffsetY]) => {
        if (engine.canvas == null) return;

        const zoom = engine.canvas.getZoom();
        const { data } = nodeEntity.resolve<Realtime.Markup.AnyNodeData>();
        const isTextNode = data.type === BlockType.MARKUP_TEXT;

        /**
         * Need this custom logic for Markup Text because Text is "CSS-driven" (see the comment in `.rotate(...)`)
         * and we need to always apply an appropriate `scale(...)` transformation to ensure resizing is properly
         * applied on Markup Text.
         */
        const nextScaleX = scaleX * (isTextNode ? (data as Realtime.Markup.NodeData.Text).scale : 1);
        const nextScaleY = scaleY * (isTextNode ? (data as Realtime.Markup.NodeData.Text).scale : 1);
        const maxWidth = isTextNode ? (data as Realtime.Markup.NodeData.Text).overrideWidth : null;

        scale.current = [nextScaleX, nextScaleY];
        textWidth.current = maxWidth;
        rotation.current = rotate;

        engine.node.translate([nodeEntity.nodeID], [shiftX / zoom, shiftY / zoom]);

        window.requestAnimationFrame(() => {
          if (!transformRef.current) return;

          if (!isTextNode) {
            transformRef.current.style.transformOrigin = 'left top';
          }

          // A number of transformations are applied here
          //
          //  - scale(...)      - This is what applies the actual resizing while we drag a handle
          //
          //  - rotate(...)     - This MUST be included, otherwise, any existing rotations get overwritten
          //                      causing the node to snap back to a rotation of 0.
          //
          //  - translate(...)  - `transformRef.current.style.transformOrigin = "left top"` causes the scaling to occur
          //                      at the original, unrotated top-left corner of the node. This can cause the
          //                      markup node to be offset from the overlay if the node has been rotated.
          //                      We MUST translate node, so that the `transformOrigin` corresponds with the
          //                      top-left corner of the rotated Markup Overlay.
          //
          //                      This issue currently only appears for Markup Images since Markup Text is
          //                      transformed relative to its center-point.

          transformRef.current.style.transform = `translate(${rotationOffsetX / zoom}px, ${
            rotationOffsetY / zoom
          }px) scale(${nextScaleX}, ${nextScaleY}) rotate(${(data as ResizableMarkupNodeData).rotate}rad)`;

          resizeOverlay();
        });
      },

      /**
       * Accumulates the effects of a special case of the scaling operation, when we drag the horizontal handles
       * of a Markup Text node and applies the changes so far as a style to the Node.
       */
      scaleText: (maxWidth: number, [shiftX, shiftY]: Pair<number>) => {
        const { data } = nodeEntity.resolve<Realtime.Markup.NodeData.Text>();
        const zoom = engine.canvas!.getZoom();

        const currWidth = textWidth.current ?? data.overrideWidth;
        const nextWidth = maxWidth / data.scale / zoom;
        const diffX = nextWidth - (currWidth ?? 0);
        const scaleDiff = (1 - data.scale) / 2;
        const scaleShiftX = diffX * -scaleDiff;

        scale.current = [data.scale, data.scale];
        rotation.current = data.rotate;
        textWidth.current = nextWidth;

        engine.node.translate([nodeEntity.nodeID], [shiftX / zoom + scaleShiftX, shiftY / zoom]);

        window.requestAnimationFrame(() => {
          if (!transformRef.current) return;

          // need to reset the min-width if this is the first time the container is being resized to clear the default
          transformRef.current.style.minWidth = '0';
          transformRef.current.style.width = `${nextWidth}px`;

          resizeOverlay();
        });
      },
    }),
    [nodeInstance, getTransform]
  );
};

import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockType } from '@/constants';
import { useNodeInstance } from '@/pages/Canvas/components/Node/hooks';
import { InternalNodeInstance } from '@/pages/Canvas/components/Node/types';
import { EngineContext, NodeEntityContext } from '@/pages/Canvas/contexts';
import { Pair } from '@/types';
import { Coords, Vector } from '@/utils/geometry';
import { getCenter } from '@/utils/rotation';

import { ResizableMarkupNodeData } from './types';
import { isResizableShape, isText } from './utils';

export type InternalMarkupInstance<T extends HTMLElement> = InternalNodeInstance<T> & {
  transformRef: React.RefObject<T>;
};

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
  const heightCache = React.useRef<number | null>(null);

  const resizeObserver = React.useMemo(
    () =>
      new ResizeObserver((entries: ResizeObserverEntry[]) =>
        entries.forEach((entry) => {
          const nextHeight = entry.contentRect.height;
          if (nextHeight !== heightCache.current) {
            engine.transformation.resizeOverlay(nextHeight);
            heightCache.current = nextHeight;
          }
        })
      ),
    []
  );

  /**
   * Returns an object containing information about the final state, such as size and position, of the
   * markup overlay at the end of a transformation like resizing.
   */
  const getTransform = React.useCallback(() => {
    const { data } = nodeEntity.resolve<Realtime.Markup.AnyNodeData>();
    const zoom = engine.canvas!.getZoom();
    const position = engine.node.api(nodeEntity.nodeID)!.instance!.getPosition();
    const [left, top] = engine.canvas!.reverseMapPoint(engine.canvas!.reverseTransformPoint(position, true));

    if (isText(data)) {
      // Get the Ref to the actual Node.
      const el = transformRef.current!;

      // Determine the final width and height of the Node after the transformation has completed.
      const scaledWidth = data.overrideWidth ? data.overrideWidth : el.offsetWidth;
      const [finalWidth, finalHeight] = [scaledWidth * data.scale * zoom, el.offsetHeight * data.scale * zoom];

      // Now compute the position of the top-left corner of the Node, after scaling is applied, but before any
      // rotations are applied.

      // 1 - Get the position and size of the bounding box (not the same thing as the Node).
      const { left: clientLeft, top: clientTop, width: clientWidth, height: clientHeight } = el.getBoundingClientRect();

      // 2 - Compute the center of the bounding box, which has the same value as the center of the Node.
      const centerPoint = new Coords(getCenter([clientLeft, clientTop], [clientWidth, clientHeight]));

      // 3 - Now compute a vector to calculate the top-left corner from the center point.
      const vecToTopleft = new Vector([finalWidth, finalHeight]).scalarDiv(2).scalarMul(-1);

      // 4 - Now compute the final top-left corner of the Node.
      const origin = centerPoint.add(vecToTopleft);

      return {
        width: finalWidth,
        height: finalHeight,
        rotate: data.rotate,
        scale: data.scale,
        invertX: false,
        invertY: false,
        origin,
      };
    }

    const resizableData = data as ResizableMarkupNodeData;

    return {
      width: resizableData.width * zoom,
      height: resizableData.height * zoom,
      rotate: resizableData.rotate,
      scale: 1,
      invertX: false,
      invertY: false,
      origin: new Coords([left, top]),
    };
  }, []);

  React.useEffect(
    () => () => {
      const transformEl = transformRef.current;

      window.requestAnimationFrame(() => {
        if (!transformEl) return;

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
      getTransform,
      /**
       * Used prepare the local state for transformation.
       */
      prepareForTransformation: () => {
        if (nodeEntity.nodeType === BlockType.MARKUP_TEXT) {
          resizeObserver.observe(transformRef.current!);
        }
      },
      /**
       * Used at the end of a transformation to publish the final state of the node into
       * the Redux store.
       */
      applyTransformations: async () => {
        const data = engine.getDataByNodeID<any>(nodeEntity.nodeID);
        const [scaleX, scaleY] = scale.current!;
        const angle = rotation.current;
        const maxWidth = textWidth.current;

        if (nodeEntity.nodeType === BlockType.MARKUP_TEXT) {
          resizeObserver.disconnect();
          heightCache.current = null;
        }

        if (isResizableShape(data)) {
          await engine.node.updateData<ResizableMarkupNodeData>(nodeEntity.nodeID, {
            width: data.width * scaleX,
            height: data.height * scaleY,
            rotate: angle % (2 * Math.PI),
          });
        } else if (isText(data)) {
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
        const transformEl = transformRef.current!;
        rotation.current = angle;

        const { data } = nodeEntity.resolve<Realtime.Markup.AnyNodeData>();
        const curScale = (data as Realtime.Markup.NodeData.Text).scale;
        const maxWidth = (data as Realtime.Markup.NodeData.Text).overrideWidth;

        const isTextNode = data.type === BlockType.MARKUP_TEXT;

        if (isTextNode) {
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
        const transformation = `${isTextNode ? `scale(${curScale}, ${curScale})` : ''} rotate(${angle}rad)`;

        window.requestAnimationFrame(() => {
          transformEl.style.transformOrigin = 'center';
          transformEl.style.transform = transformation;
        });
      },

      /**
       * Accumulates the effects of a scaling operation and applies the changes so far as a style to
       * the Node.
       */
      scale: ([scaleX, scaleY], [shiftX, shiftY], rotate, [rotationOffsetX, rotationOffsetY]) => {
        const { data } = nodeEntity.resolve<Realtime.Markup.AnyNodeData>();
        const transformEl = transformRef.current!;
        const zoom = engine.canvas!.getZoom();
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
          if (!isTextNode) {
            transformEl.style.transformOrigin = 'left top';
          }

          // A number of transformations are applied here
          //
          //  - scale(...)      - This is what applies the actual resizing while we drag a handle
          //
          //  - rotate(...)     - This MUST be included, otherwise, any existing rotations get overwritten
          //                      causing the node to snap back to a rotation of 0.
          //
          //  - translate(...)  - `transformEl.style.transformOrigin = "left top"` causes the scaling to occur
          //                      at the original, unrotated top-left corner of the node. This can cause the
          //                      markup node to be offset from the overlay if the node has been rotated.
          //                      We MUST translate node, so that the `transformOrigin` corresponds with the
          //                      top-left corner of the rotated Markup Overlay.
          //
          //                      This issue currently only appears for Markup Images since Markup Text is
          //                      transformed relative to its center-point.

          transformEl.style.transform = `translate(${rotationOffsetX / zoom}px, ${
            rotationOffsetY / zoom
          }px) scale(${nextScaleX}, ${nextScaleY}) rotate(${(data as ResizableMarkupNodeData).rotate}rad)`;
        });
      },

      /**
       * Accumulates the effects of a special case of the scaling operation, when we drag the horizontal handles
       * of a Markup Text node and applies the changes so far as a style to the Node.
       */
      scaleText: (maxWidth: number, [shiftX, shiftY]: Pair<number>) => {
        const transformEl = transformRef.current!;
        const { data } = nodeEntity.resolve<Realtime.Markup.NodeData.Text>();
        const zoom = engine.canvas!.getZoom();

        const currWidth = textWidth.current ?? data.overrideWidth;
        const nextWidth = maxWidth / data.scale / zoom;
        const diffX = nextWidth - (currWidth ?? 0);
        const scaleDiff = (1 - data.scale) / 2;
        const scaleShiftX = diffX * -scaleDiff;

        textWidth.current = nextWidth;
        scale.current = [data.scale, data.scale];
        rotation.current = data.rotate;

        engine.node.translate([nodeEntity.nodeID], [shiftX / zoom + scaleShiftX, shiftY / zoom]);

        window.requestAnimationFrame(() => {
          // need to reset the min-width if this is the first time the container is being resized to clear the default
          transformEl.style.minWidth = '0';
          transformEl.style.width = `${nextWidth}px`;
        });
      },
    }),
    [nodeInstance, getTransform]
  );
};

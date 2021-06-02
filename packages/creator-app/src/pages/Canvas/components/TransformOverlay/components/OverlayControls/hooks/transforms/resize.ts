import React from 'react';

import { BlockType, ZERO_VECTOR } from '@/constants';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Coords, Vector } from '@/utils/geometry';
import { getCenter, rotateCoords } from '@/utils/rotation';

import { HandlePosition, TEXT_WIDTH_HANDLES } from '../../../../constants';
import { getResizeTransformations } from '../../../../utils';
import { OverlayState } from '../../types';

const useResize = (nodeType: BlockType | null, { ref, handlePosition, position, size, snapshot, rotation }: OverlayState) => {
  const engine = React.useContext(EngineContext)!;

  const handleResize = React.useCallback(
    (event: MouseEvent) => {
      const mousePosition = engine.mousePosition.current!;
      const handle = handlePosition.current!;
      const el = ref.current!;
      const transform = snapshot.current!;
      const [width, height] = size.current!;
      const [left, top] = position.current!;
      const mousePos = new Coords(mousePosition);
      const curRotation = rotation.current!;
      const isTextNode = nodeType === BlockType.MARKUP_TEXT;

      const result = getResizeTransformations(transform, handle, [left, top], [width, height], mousePos.raw(), event, isTextNode);
      let [nextLeft, nextTop] = result.position;
      let [nextWidth, nextHeight] = result.size;

      if (isTextNode) {
        if (TEXT_WIDTH_HANDLES.includes(handle)) {
          const [mouseX] = mousePos.raw();
          const isRotated180 = curRotation > Math.PI / 2 && curRotation < (3 * Math.PI) / 2;

          if (handle === HandlePosition.RIGHT && isRotated180) {
            const moveX = left - mouseX;

            nextWidth = width + moveX;
            nextLeft -= moveX;

            engine.transformation.scaleTextTarget(nextWidth, [width - nextWidth, 0]);
          } else if (handle === HandlePosition.LEFT && !isRotated180) {
            const moveX = left - mouseX;

            nextWidth += moveX;
            nextLeft -= moveX;

            engine.transformation.scaleTextTarget(nextWidth, [width - nextWidth, 0]);
          } else {
            nextWidth = mouseX - left;

            nextLeft = handle === HandlePosition.LEFT ? left : nextLeft;

            engine.transformation.scaleTextTarget(nextWidth, ZERO_VECTOR);
          }
        } else {
          const transformSize = new Vector([transform.width, transform.height]);
          const origin = transform.origin.add(transformSize.scalarDiv(2));

          const diff = mousePos.sub(origin).applyElementwise(Math.abs);
          const scale = diff.div(transformSize.scalarDiv(2));

          const maxScale = Math.max(...scale.point);

          const nextSize = transformSize.scalarMul(maxScale);
          const nextTopleft = origin.sub(nextSize.scalarDiv(2));

          [nextLeft, nextTop] = nextTopleft.raw();
          [nextWidth, nextHeight] = transformSize.scalarMul(maxScale).raw();

          engine.transformation.scaleTarget([maxScale, maxScale], ZERO_VECTOR, curRotation, ZERO_VECTOR);
        }
      } else {
        // TODO - Refactor resize to use Coords so we don't need to manually convert
        const rotationAxis = new Coords(getCenter([nextLeft, nextTop], [nextWidth, nextHeight]));
        const nextTopleft = new Coords([nextLeft, nextTop]);
        const rotatedNextTopleft = rotateCoords(nextTopleft, rotationAxis, curRotation);
        const rotationOffset = rotatedNextTopleft.sub(nextTopleft).raw();

        engine.transformation.scaleTarget(result.scale, result.shift, curRotation, rotationOffset);
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

  const resizeOverlay = React.useCallback((height: number) => {
    const el = ref.current!;
    const [width, currHeight] = size.current!;
    const [left, currTop] = position.current!;
    const { scale } = snapshot.current!;
    const zoomedHeight = height * engine.canvas!.getZoom();
    const nextHeight = zoomedHeight * scale;
    const diffY = zoomedHeight - currHeight / scale;
    const scaleDiff = (1 - scale) / 2;
    const scaleShiftY = scaleDiff * diffY;
    const nextTop = currTop + scaleShiftY;

    position.current = [left, nextTop];
    size.current = [width, nextHeight];

    window.requestAnimationFrame(() => {
      el.style.height = `${nextHeight}px`;
      el.style.top = `${nextTop}px`;
    });
  }, []);

  const startResize = React.useCallback((handle: HandlePosition) => {
    handlePosition.current = handle;
  }, []);

  const endResize = React.useCallback(() => {
    handlePosition.current = null;
  }, []);

  return {
    handleResize,
    resizeOverlay,
    startResize,
    endResize,
  };
};

export default useResize;

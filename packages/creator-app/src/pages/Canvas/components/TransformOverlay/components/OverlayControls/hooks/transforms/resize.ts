/* eslint-disable no-param-reassign */
import React from 'react';

import { BlockType, ZERO_VECTOR } from '@/constants';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Coords, Vector } from '@/utils/geometry';
import { getCenter, rotateCoords } from '@/utils/rotation';

import { HandlePosition, TEXT_WIDTH_HANDLES } from '../../../../constants';
import { calculateRotatedBoundingRect, getResizeTransformations } from '../../../../utils';
import { OverlayState } from '../../types';

const useResize = (nodeType: BlockType | null, { ref, handlePosition, position, size, snapshot, rotation }: OverlayState) => {
  const engine = React.useContext(EngineContext)!;

  const handleResize = React.useCallback(
    (event: MouseEvent) => {
      if (
        size.current === null ||
        snapshot.current === null ||
        position.current === null ||
        rotation.current === null ||
        handlePosition.current === null ||
        engine.mousePosition.current === null
      )
        return;

      const handle = handlePosition.current;
      const transform = snapshot.current;
      const [left, top] = position.current;
      const curRotation = rotation.current;
      const [width, height] = size.current;
      const mousePosition = engine.mousePosition.current;

      const mousePos = new Coords(mousePosition);
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
          const transformSize = new Vector([transform.rect.width, transform.rect.height]);
          const origin = transform.origin.add(transformSize.scalarDiv(2));

          const diff = mousePos.sub(origin).applyElementwise(Math.abs);
          const scale = diff.div(transformSize.scalarDiv(2));

          const maxScale = Math.max(...scale.point);

          const nextSize = transformSize.scalarMul(maxScale);
          const nextTopLeft = origin.sub(nextSize.scalarDiv(2));

          [nextLeft, nextTop] = nextTopLeft.raw();
          [nextWidth, nextHeight] = transformSize.scalarMul(maxScale).raw();

          engine.transformation.scaleTarget([maxScale, maxScale], ZERO_VECTOR, curRotation, ZERO_VECTOR);
        }
      } else {
        // TODO - Refactor resize to use Coords so we don't need to manually convert
        const rotationAxis = new Coords(getCenter([nextLeft, nextTop], [nextWidth, nextHeight]));
        const nextTopLeft = new Coords([nextLeft, nextTop]);
        const rotatedNextTopLeft = rotateCoords(nextTopLeft, rotationAxis, curRotation);
        const rotationOffset = rotatedNextTopLeft.sub(nextTopLeft).raw();

        engine.transformation.scaleTarget(result.scale, result.shift, curRotation, rotationOffset);
      }
    },
    [nodeType]
  );

  const resizeOverlay = React.useCallback((rect: DOMRect) => {
    const { width, height, left, top } = calculateRotatedBoundingRect(rect, rotation.current ?? 0);

    size.current = [width, height];
    position.current = [left, top];

    if (!ref.current) return;

    ref.current.style.top = `${top}px`;
    ref.current.style.left = `${left}px`;
    ref.current.style.width = `${width}px`;
    ref.current.style.height = `${height}px`;
    ref.current.style.transform = `rotate(${rotation.current ?? 0}rad)`;
  }, []);

  const startResize = React.useCallback((handle: HandlePosition) => {
    handlePosition.current = handle;
  }, []);

  const endResize = React.useCallback(() => {
    handlePosition.current = null;
  }, []);

  return {
    endResize,
    startResize,
    handleResize,
    resizeOverlay,
  };
};

export default useResize;

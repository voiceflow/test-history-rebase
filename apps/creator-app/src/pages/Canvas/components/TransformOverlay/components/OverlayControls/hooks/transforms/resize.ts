import React from 'react';

import { BlockType } from '@/constants';
import { useLinkedRef } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import type { Point } from '@/types';

import type { HandlePosition } from '../../../../constants';
import { TEXT_WIDTH_HANDLES } from '../../../../constants';
import { calculateRotatedBoundingRect, getScaleTransformations, getStretchTransformations } from '../../../../utils';
import type { OverlayState } from '../../types';

const useResize = (nodeType: BlockType | null, { overlayRect, snapshot, rotation }: OverlayState) => {
  const engine = React.useContext(EngineContext)!;

  const resizeParams = React.useRef<{ mouseStart: Point; handle: HandlePosition } | null>(null);
  const type = useLinkedRef(nodeType);

  const handleResize = React.useCallback(() => {
    const transform = engine.transformation.getTransform();
    if (
      transform === null ||
      overlayRect.current === null ||
      snapshot.current === null ||
      rotation.current === null ||
      resizeParams.current === null ||
      engine.mousePosition.current === null
    )
      return;

    const { mouseStart, handle } = resizeParams.current;
    const mousePosition = engine.mousePosition.current;

    const isTextNode = type.current === BlockType.MARKUP_TEXT;

    const currentTransform = {
      rect: calculateRotatedBoundingRect(transform.rect, transform.rotate),
      rotate: rotation.current,
    };
    if (isTextNode && TEXT_WIDTH_HANDLES.includes(handle)) {
      const result = getStretchTransformations(handle, snapshot.current, currentTransform, mousePosition);
      if (result) {
        engine.transformation.scaleTextTarget(result.width, result.shift);
      }
    } else {
      const { scale, shift } = getScaleTransformations(
        handle,
        snapshot.current,
        currentTransform,
        mouseStart,
        mousePosition
      );
      engine.transformation.scaleTarget(scale, shift);
    }
  }, []);

  return React.useCallback((handle: HandlePosition) => {
    const mousePosition = engine.mousePosition.current;
    if (!mousePosition) return;

    engine.transformation.start();
    resizeParams.current = {
      mouseStart: mousePosition,
      handle,
    };

    document.addEventListener(
      'mouseup',
      () => {
        engine.transformation.complete();
        document.removeEventListener('mousemove', handleResize);
      },
      { once: true }
    );
    document.addEventListener('mousemove', handleResize, false);
  }, []);
};

export default useResize;

import React from 'react';

import { EngineContext } from '@/pages/Canvas/contexts';
import { Vector } from '@/utils/geometry';
import { getRotation } from '@/utils/math';

import { OverlayState } from '../../types';

const useRotate = ({ ref, snapshot, isRotating, rotation }: OverlayState) => {
  const engine = React.useContext(EngineContext)!;

  const handleRotate = React.useCallback(() => {
    const el = ref.current!;
    const transform = snapshot.current!;

    const transformSize = new Vector([transform.width, transform.height]);

    const [centerX, centerY] = transform.origin.add(transformSize.scalarDiv(2)).point;
    const [mouseX, mouseY] = engine.mousePosition.current!;

    const deltaX = mouseX - centerX;
    const deltaY = centerY - mouseY;
    const rotate = getRotation(deltaX, deltaY);

    rotation.current = rotate;

    engine.transformation.rotateTarget(rotate);
    window.requestAnimationFrame(() => {
      el.style.transform = `rotate(${rotate}rad)`;
    });
  }, []);

  const startRotate = React.useCallback(() => {
    isRotating.current = true;
  }, []);

  const endRotate = React.useCallback(() => {
    isRotating.current = false;
  }, []);

  return {
    startRotate,
    endRotate,
    handleRotate,
  };
};

export default useRotate;

/* eslint-disable no-param-reassign */
import React from 'react';

import { EngineContext } from '@/pages/Canvas/contexts';
import { Vector } from '@/utils/geometry';
import { getRotation } from '@/utils/math';

import { OverlayState } from '../../types';

const useRotate = ({ snapshot, isRotating, rotation }: OverlayState) => {
  const engine = React.useContext(EngineContext)!;

  const handleRotate = React.useCallback(() => {
    if (!snapshot.current || !engine.mousePosition.current) return;

    const transform = snapshot.current;

    const transformSize = new Vector([transform.rect.width, transform.rect.height]);

    const [centerX, centerY] = transform.origin.add(transformSize.scalarDiv(2)).point;
    const [mouseX, mouseY] = engine.mousePosition.current;

    const deltaX = mouseX - centerX;
    const deltaY = centerY - mouseY;
    const rotate = getRotation(deltaX, deltaY);

    rotation.current = rotate;

    engine.transformation.rotateTarget(rotate);
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
